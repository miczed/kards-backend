import { observable, computed, action} from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';
import {reaction, transaction} from 'mobx';


/* BEWARE: When writing to Maps we should use transactions, otherwise a lot of events get fired from mobx */

export default class SetStore {
    userStore;
    @observable sets = observable.map({});
    constructor(userStore) {
        this.userStore = userStore;
        firebaseApp.database().ref('users').child(userStore.user.uid).child('sets').on('child_added', (snap) => {
            this.getSingleRef(snap.key).once((snap) => {
               // A new set was created on the server
                if(!this.sets.get(snap.key)) { // add set to client if it didn't already happen
                    let set = new Set(snap.key,snap.title,snap.views,snap.collaborators,snap.cards,snap.fork_of);
                    this.sets.set(snap.key,set);
                }
            });
        });
        firebaseApp.database().ref('users').child(userStore.user.uid).child('sets').on('child_removed', (snap) => {
            // A set was deleted on the server => delete it from the client
            if(this.sets.get(snap.key)) {
                this.sets.get(snap.key).delete();
                this.sets.delete(snap.key);
            }
        });
    }

    /**
     * Returns the firebase reference to all the sets
     * @returns {*} Firebase Reference
     */
    getAllRef() {
        return firebaseApp.database().ref('sets');
    }

    /**
     * Gets the ref to a single set
     * @param key : String Firebase Key of the Set
     * @returns {*} Firebase Reference
     */
    getSingleRef(key) {
        return this.getAllRef().child(key);
    }

    /**
     * Creates a new set on the client and on firebase and adds it to the store
     * @pre User is logged in
     * @post User is added as a collaborator to set
     * @param title : String title of the set
     */
    create(title) {
        const user = this.userStore.user;
        if(!user) {
            return Promise.reject(new Error('You have to be logged in, to create a new set.'));
        }
        const key = this.getAllRef().push().key;
        const views = 0;
        const collaborators = new Map();
        const cards = new Map();
        collaborators.set(user.uid,true);

        let set = new Set(this,key,title,views,collaborators,cards,null);
        set.autoSave = false;
        return this.getAllRef().child(key).set(set.asJson).then(() => { // Store set to firebase
            this.sets.set(key,set); // Store set in store
            set.autoSave = true;
            return set;
        }).then((set) => {
            // TODO: save set to users tree
            return set;
        });
    }

    /**
     * Deletes a set on the client and on firebase and removes it from the store
     * @param set:Set which should be deleted
     */
    remove(set)  {
        this.sets.delete(set.key); // Remove set from store
        set.remove(); // Prepares element for deletion
        return this.getAllRef().child(set.key).remove().then(() => { // Remove from firebase database
            return true;
            //UserStore.deleteSetFromUser(set.key) // TODO: remove set from users tree
        });
    }
}

/**
 * Set Object which is used on the client
 */
export class Set {
    key = null;
    store = null;
    @observable title = "";
    @observable views = null;

    /* References to user objects from the UserStore */
    @observable collaborators = observable.map({});
    @observable cards = observable.map({});

    fork_of = null;

    autoSave = null; // Updates from server only get applied if this flag is set to true
    saveHandler = false;

    constructor(store,key,title,views, collaborators, cards, fork_of) {
        this.store = store;
        this.key = key;
        this.title = title;
        this.views = views;
        this.collaborators = collaborators;
        this.cards = cards;
        this.fork_of = fork_of;
        this.autoSave = true;

        // Set is listening on itself on the server, to make changes to itself
        this.store.getSingleRef(key).on('value',(snap) => {
            if(this.autoSave) {
                this.updateFromJson(snap.val());
            } else {
                this.autoSave = true;
            }

        });

        this.saveHandler = reaction(
            () => this.asJson,
            (json) => {
                if(this.autoSave) {
                    this.store.getSingleRef(this.key).update(json).then(() => {});
                    this.autoSave = false;
                }
            }
        )
    }

    /**
     * Updates the object based on a jsobject
     * @param json
     */
    updateFromJson(json) {
        this.autoSave = false; // make sure our changes aren't sent back to the server
        this.title = json.title;
        this.views = json.views;
        this.collaborators.clear();
        for (let [key, value] of Object.entries(json.collaborators)) {
            this.collaborators.set(key,value);
        }
        this.cards.clear();
        for (let [key, value] of Object.entries(json.cards)) {
            this.cards.set(key,value);
        }
        this.fork_of = json.fork_of;

        this.autoSave = true;

    }

    @computed get asJson() {
        return {
            title: this.title,
            views: this.views,
            collaborators: this.collaborators.toJS(),
            cards: this.cards.toJS(),
            fork_of: this.fork_of,
        };
    }

    /**
     * Do some cleaning up, so the object gets collected by the JS garbage collector (hopefully)
     */
    remove() {
        this.store.getSingleRef(this.key).off();
        this.saveHandler(); // clean up the observer
    }

}
