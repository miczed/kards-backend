import { observable, computed, action } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

/**
 * Store which stores the current user login / authentication
 */

class UserStore {

    @observable user = undefined;

    constructor(){
      this.startAuthStateListener();
    }

    @action startAuthStateListener() {
      firebaseApp.auth().onAuthStateChanged(action((user) => {
            if (user) {
                this.user = user;
            } else {
                this.user= null;
            }
        }));
    }

    login(email, password) {
        firebaseApp.auth().signInWithEmailAndPassword(email, password).catch((error) => {
          // TODO: Add custom error messages for each case
          // TODO: Add language support for error messages
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
           alert('Wrong password.');
          } else if (errorCode === 'auth/invalid-email') {
              alert('E-Mail Adress invalid');
          } else if (errorCode === 'auth/user-not-found') {
              alert('There is no user registred to this e-mail adress.');
              // TODO: Redirect user to registration page automatically and fill in e-mail adress there
          } else {
              alert(errorMessage);
          }
          console.log(error);
        });
    }

    /**
     * UNTESTED
     * Creates a new user and automatically logs the user in,
     * if the registration was sucessful ( onAuthStateChanged is called )
     * @param email
     * @param password
     * @param username
     *
     */
    newUser(email,password,username) {
        firebaseApp.auth().createUserWithEmailAndPassword(email,password).then(action((user) => {
            this.user = user;
            this.user.username = username;
            this.updateUser({username : username});
        }),(error) => {
           switch(error) {
               case 'auth/email-already-in-use':
                   alert('This E-Mail is already in use');
                   break;
               case 'auth/invalid-email':
                   alert('Please enter a valid E-Mail adress.');
                   break;
               case 'auth/operation-not-allowed':
                   alert('Currently the user registration is not possible.');
                   break;
               case 'auth/weak-password':
                   alert('Your password is too weak. Please try a different one.');
                   break;
           }
        });
    }

    /**
     * UNTESTED
     * Updates the profile of a signed in user
     * @param userChanges : Object which contains the fields that should be updated
     */
    updateUser(userChanges) {
        let user = firebase.auth().currentUser;
        if(user) {
            user.updateProfile(userChanges).catch((error) => {
                alert(error);
            });
        } else {
            alert('You have to be logged in, to perform this action.');
        }
    }

    /**
     * UNTESTED
     * Deletes the currently logged in user
     */
    deleteUser() {
        let user = firebase.auth().currentUser;
        if(user) {
            user.delete();
        } else {
            alert('You have to be logged in, to perform this action.');
        }
    }
    logout() {
        firebaseApp.auth().signOut().then(action(() => {
            this.user = null;
        }), function(error) {
            console.log(error);
        });
    }
}

export default new UserStore();