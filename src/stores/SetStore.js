import { observable, computed, action } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

export default class SetStore {
    @observable sets = map({});

    constructor() {
        this.getAllRef().on('value', (snapshot) => {
            this.sets = snapshot.val();
        });
    }

    /**
     * Returns the firebase reference to all the sets
     * @returns {*} reference to the firebase object
     */
    getAllRef() {
        return firebaseApp.database().ref('sets');
    }

    // UNTESTED
    update(cardKey,updatedObj,userId) {
        return this.getAllRef().update({[cardKey] : updatedObj});
    }

    // UNTESTED
    add(title,userId) {
        const key = this.getAllRef().push().key;
        return this.update(key, {title: title},userId);
        // TODO: add set to users tree
    };

    // UNTESTED
    delete(cardKey, userId)  {
        this.getAllRef().child(cardKey).remove();
        // TODO: remove set from users tree
    };
}
