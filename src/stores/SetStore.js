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
            if(!this.sets.get(snap.key)) {
                let set = new Set(this,snap.key);
                this.sets.set(snap.key,set);
                /*this.getSingleRef(snap.key).once('value',(snap) => {
                    // A new set was created on the server
                    if(!this.sets.get(snap.key)) { // add set to client if it didn't already happen
                        console.log('New set was added on the server.',snap.val());
                        let set = new Set(this,snap.key,snap.val().title,snap.val().views,snap.val().collaborators,snap.val().cards,snap.val().fork_of);
                        this.sets.set(snap.key,set);
                    }
                });*/
            }
        });
        firebaseApp.database().ref('users').child(userStore.user.uid).child('sets').on('child_removed', (snap) => {
            // A set was deleted on the server => delete it from the client
            if(this.sets.get(snap.key)) {
                this.sets.get(snap.key).remove();
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
        if(!title || title == "") {
            return Promise.reject(new Error('The title of a set cannot be empty.'));
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
            // TODO: This doesn't always work -> WHY NOT?
            this.userStore.getSetsRef().child(set.key).set(true);
            return set;
        });
    }

    /**
     * Deletes a set on the client and on firebase and removes it from the store
     * @param setKey : String key of the set which should be deleted
     */
    remove(setKey)  {
        const set = this.sets.get(setKey);
        if(set) {
            this.sets.delete(setKey); // Remove set from store
            set.remove(); // Prepares element for deletion
        }
        return this.getAllRef().child(set.key).remove().then(() => { // Remove from firebase database
            return this.userStore.getSetsRef().child(set.key).remove(); // Remove from user tree
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

    autoSave = null; // Updates from / to server only get applied if this flag is set to true
    saveHandler = false;

    constructor(store,key,title = "",views = 0, collaborators = {}, cards = {}, fork_of = null) {
        this.store = store;
        this.key = key;
        this.title = title;
        this.views = views;
        this.collaborators.replace(collaborators);
        this.cards.replace(cards);
        this.fork_of = fork_of;
        this.autoSave = true;

        // Set is listening on itself on the server, to make changes to itself
        this.store.getSingleRef(key).on('value',(snap) => {
            console.log("I changed on Firebase");
            if(this.autoSave) {
                console.log("I will update myself.", snap.val());
                this.autoSave = false;
                this.updateFromJson(snap.val());
                this.autoSave = true;
            } else {
                this.autoSave = true;
            }

        });

        this.saveHandler = reaction(
            () => this.asJson,
            (json) => {
                console.log("I changed locally");
                if(this.autoSave) {
                    console.log('I will push my updates to firebase');
                    this.autoSave = false; // Set autosave to false, so changes aren't updated from firebase.
                    this.store.getSingleRef(this.key).update(json).then(() => {});
                }
            }
        )
    }

    /**
     * Updates the object based on a jsobject
     * @param json
     */
    @action updateFromJson(json) {
        console.log('I will update myself based on JSON values');
        this.title = json.title;
        this.views = json.views;
        if(!json.collaborators) { json.collaborators = {}};
        if(!json.cards) { json.cards = {}};
        this.collaborators.replace(json.collaborators);
        this.cards.replace(json.cards);
        this.fork_of = json.fork_of;
    }


    @computed get asJson() {
        return {
            title: this.title,
            views: this.views,
            collaborators: (this.collaborators ? this.collaborators.toJS() : null) ,
            cards: (this.cards ? this.cards.toJS() : null),
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
