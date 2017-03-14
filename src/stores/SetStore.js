import { observable, computed, action } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

export default class SetStore {
    userStore;
    @observable sets = map({});
    constructor(userStore) {
        this.userStore = userStore;

        firebaseApp.database().ref('users').child(userStore.key).child('sets').on('child_added', (snap) => {
            this.getSingleRef(snap.key).once((snap) => {
               let set = new Set(snap.key,snap.title,snap.views,snap.collaborators,snap.cards,snap.fork_of);
               this.sets.add(snap.key,set);
            });
        });
        firebaseApp.database().ref('users').child(userStore.key).child('sets').on('child_removed', (snap) => {
            this.sets.delete(snap.key);
        });
    }

    /**
     * Returns the firebase reference to all the sets
     * @returns {*} reference to the firebase object
     */
    getAllRef() {
        return firebaseApp.database().ref('sets');
    }

    getSingleRef(key) {
        return this.getAllRef().child(key);
    }

    // UNTESTED
    update(cardKey,updatedObj,userId) {
        return this.getAllRef().update({[cardKey] : updatedObj});
    }

    // UNTESTED
    add(title,userId) {
        const key = this.getAllRef().push().key;
        return this.update(key, {title: title},userId).then(() => {
            // TODO: add set to users tree
            // this.userStore.addCard(key);
        });
    };

    // UNTESTED
    delete(set)  {
        this.sets.delete(set.key);
        this.getAllRef().child(set.key).remove();
        set.dispose();
        //UserStore.deleteSetFromUser(set.key) // TODO: remove set from users tree
    }
}

export class Set {
    key = null;
    store = null;
    @observable title = "";
    @observable views = null;
    /* References to user objects from the UserStore */
    @observable collaborators = map({});
    @observable cards = map({});

    fork_of = null;

    constructor(store,key,title,views, collaborators, cards, fork_of) {
        this.store = store;
        this.store.getSingleRef(key).on('child_changed',(snap) => {
           // TODO Update self
        });
    }

    /**
     * Remove this set from the client and server
     */
    delete() {
        this.store.removeSet(this);
        this.store.getSingleRef(this.key).off();
    }

}
