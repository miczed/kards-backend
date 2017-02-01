import { observable, computed } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

/**
 * Store which stores the current user login / authentication
 */

class UserStore {

    @observable user = {
      firebaseUser: null,
      ID: null,
      surname: null,
      lastname: null,
    };

    constructor(){
      this.startAuthStateListener();
    }

    startAuthStateListener() {
      firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user.firebaseUser = user;
            } else {
                this.user.firebaseUser = null;
            }
        }).bind(this);
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
        firebaseApp.auth().signOut().then(function() {
          // do nothing --> startAuthStateListener already listens to changes
        }.bind(this), function(error) {
            console.log(error);
        });
    }

    @computed get fullName(){
      return this.surname + " " + this.lastname;
    }
}

export default new UserStore();