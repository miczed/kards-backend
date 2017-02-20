import { observable, computed } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

/**
 * Store which stores the current user login / authentication
 */

class UserStore {

    @observable user = undefined;

    constructor(){
      this.startAuthStateListener();
    }

    startAuthStateListener() {
      firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
            } else {
                this.user= null;
            }
        });
    }

    login(email, password) {
        firebaseApp.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // TODO: Add custom error messages for each case
          // TODO: Add language support for error messages
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
           alert('Wrong password.');
          } else {
           alert(errorMessage);
          }
          console.log(error);
        });
    }

    logout() {
        firebaseApp.auth().signOut().then(() => {
          this.user = null;
        }, function(error) {
            console.log(error);
        });
    }

    @computed get fullName(){
      return this.surname + " " + this.lastname;
    }
}

export default new UserStore();