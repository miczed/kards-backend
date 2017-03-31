import { observable, computed, action} from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';
import {reaction, transaction} from 'mobx';

/* BEWARE: When writing to Maps we should use transactions, otherwise a lot of events get fired from mobx */

/**
 * CardStore which handles all the logic for the cards. Each CardStore belongs to a specific Set. Therefore we initialize it with a given set key.
 */

export default class CardStore {
    setKey;
    userStore;
    setStore;
    @observable cards = observable.map({});
    constructor(setKey,userStore,setStore) {
        this.setKey = setKey;
        this.userStore = userStore;
        this.setStore = setStore;
        firebaseApp.database().ref('sets').child(setKey).child('cards').on('child_added', (snap) => {
            if(!this.sets.get(snap.key)) {
                let card = new Card(this,snap.key);
                this.cards.set(snap.key,card);
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
        firebaseApp.database().ref('sets').child(setKey).child('cards').on('child_removed', (snap) => {
            // A set was deleted on the server => delete it from the client
            if(this.cards.get(snap.key)) {
                this.cards.get(snap.key).remove();
                this.cards.delete(snap.key);
            }
        });
    }

    /**
     * Returns the firebase reference to all the cards
     * @returns {*} Firebase Reference
     */
    getAllRef() {
        return firebaseApp.database().ref('cards');
    }

    /**
     * Gets the ref to a single card
     * @param key : String Firebase Key of the card
     * @returns {*} Firebase Reference
     */
    getSingleRef(key) {
        return this.getAllRef().child(key);
    }

    /**
     * Creates a new card on the client and on firebase and adds it to the store
     * @pre User is logged in
     * @post User is added as a collaborator to set
     * @param title : string title of the card
     * @param front_delta:obj quill delta object of the front of the card
     * @param back_delta:obj quill delta object of the back of the card
     * @param front_html:string html of the front of the card
     * @param back_html:string html of the back of the card
     */
    @action
    create(title,front_delta,front_html,back_delta,back_html) {
        const setKey = this.setKey;
        const user = this.userStore.user;
        if(!user) {
            return Promise.reject(new Error('You have to be logged in, to create a new card.'));
        }
        if(!title || title == "") {
            return Promise.reject(new Error('The title of a card cannot be empty.'));
        }
        if(!front_delta || front_html == "") {
            return Promise.reject(new Error('The front side of a card cannot be empty.'));
        }
        if(!back_delta || back_html == "") {
            return Promise.reject(new Error('The back side of a card cannot be empty.'));
        }

        const key = this.getAllRef().push().key;
        const views = 0;
        const collaborators = new Map();
        collaborators.set(user.uid,true);

        let card = new Card(this,key,title,views,collaborators,front_delta,back_delta,front_html,back_html);
        card.autoSave = false;
        return this.getAllRef().child(key).set(card.asJson).then(() => { // Store card to firebase
            this.cards.set(key,card); // Store set in store
            card.autoSave = true;
            return card;
        }).then((card) => {
            // TODO: This doesn't always work -> WHY NOT?
            this.setStore.getSingleRef(this.setKey).child("cards/" + card.key).set(true);
            return card;
        });
    }

    /**
     * Deletes a card on the client and on firebase and removes it from the store
     * @param key:string key of the card which should be deleted
     */
    remove(key)  {
        const card = this.cards.get(key);
        if(card) {
            this.sets.delete(setKey); // Remove set from store
            card.remove(); // Prepares element for deletion
        }
        return this.getAllRef().child(card.key).remove().then(() => { // Remove from firebase database
            return this.setStore.getSingleRef(this.setKey).child("cards/"+card.key).remove(); // Remove from set tree
        });
    }
}

/**
 * Set Object which is used on the client
 */
export class Card {
    key = null;
    store = null;

    @observable front_delta: string;
    @observable front_html: string;
    @observable back_delta: string;
    @observable back_html: string;
    @observable collaborators = observable.map({}); /* References to user objects from the UserStore */
    @observable views: number;
    @observable title:string;
    @observable fork_of:string;

    autoSave = null; // Updates from / to server only get applied if this flag is set to true
    saveHandler = false;

    constructor(store,key,title = "",views = 0, collaborators = {}, front_delta = {},back_delta = {},front_html = "",back_html = "", fork_of = null) {
        this.store = store;
        this.key = key;
        this.title = title;
        this.views = views;
        this.collaborators.replace(collaborators);
        this.front_delta = front_delta;
        this.back_delta = back_delta;
        this.front_html = front_html;
        this.back_html = back_html;
        this.fork_of = fork_of;
        this.autoSave = true;

        // Card is listening on itself on the server, to make changes to itself
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
        this.front_delta = json.front_delta;
        this.front_html = json.front_html;
        this.back_delta = json.back_delta;
        this.back_html = json.back_html;
        if(!json.collaborators) { json.collaborators = {}};
        this.fork_of = json.fork_of;
    }

    @computed get asJson() {
        return {
            title: this.title,
            views: this.views,
            front_delta: this.front_delta,
            front_html: this.front_html,
            back_delta: this.back_delta,
            back_html: this.back_html,
            collaborators: (this.collaborators ? this.collaborators.toJS() : null) ,
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
