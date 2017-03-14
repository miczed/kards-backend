import { observable, computed, action } from 'mobx';
import firebaseApp from '../helpers/firebase.jsx';

/**
 * Store which stores the current user login / authentication
 */

class UserStore {

    @observable user = undefined;
    @observable username = undefined;
    @observable lastname = undefined;
    @observable firstname = undefined;

    constructor(){
      this.startAuthStateListener();
    }

    @action startAuthStateListener() {
      firebaseApp.auth().onAuthStateChanged(action((user) => {
          // TODO: Discuss if email has to be verified or not --> maybe problems with user onboarding and loosing customers
          // if(user.emailVerified) {
              if (user) {
                  this.user = user;
                  this.getUserInfo(user.uid);
              } else {
                  this.user = null;
              }
          // }
          /* else {
              alert('Please confirm your email address first. Didn\'t got an email? Click on the «Send confirmation email» Button again.');
              this.logout();
          } */
        }));
    }

    /**
     * Logs the user in and gets it's profile information from the DB
     * @param email
     * @param password
     * @returns firebase.Promise
     */
    login(email, password) {
        return firebaseApp.auth().signInWithEmailAndPassword(email, password).then(action((user) => {
            this.user = user;
            return this.getUserInfo(user.uid);
        }));
    }

    /**
     * Logs the currently signed in user out
     * @returns firebase.Promise
     */
    logout() {
        return firebaseApp.auth().signOut().then(action(() => {
            this.user = null;
        }));
    }

    /**
     * UNTESTED
     * Gets username, lastname and firstname for user ID in Firebase DB
     * @param uid
     */
    getUserInfo(uid) {
        firebaseApp.database().ref("users/" + uid).once("value", action((snapshot) => {
            this.username = snapshot.val() ? snapshot.val().username : null;
            this.lastname = snapshot.val() ? snapshot.val().lastname : null;
            this.firstname = snapshot.val() ? snapshot.val().firstname : null;
        }));
    }

    /**
     * Creates a new user and automatically logs the user in,
     * if the registration was sucessful ( onAuthStateChanged is called )
     * @param email
     * @param password
     * @param username
     * @param firstname
     * @param lastname
     * @returns Promise | firebase.Promise
     */
    createNewUser(email,password,username, firstname, lastname) {
        return firebaseApp.auth().createUserWithEmailAndPassword(email,password).then(action((user) => {
            // Set observable store values
            this.user = user;
        })).then(() => {
            // Save information about user in Firebase
            return this.updateUserInfo(username, firstname,lastname)
        });
    }

    /**
     * Updates the profile of a signed in user
     * @param username
     * @param firstname
     * @param lastname
     * @returns Promise || firebase.Promise
     */
    updateUserInfo(username, firstname, lastname) {
        let user = firebaseApp.auth().currentUser;
        if(user) {
            const userInfoChanges = { username: username, firstname: firstname, lastname: lastname};
            return firebaseApp.database().ref('/users/' + user.uid).update(userInfoChanges).then(action(() => {
                this.username = username;
                this.firstname = firstname;
                this.lastname = lastname;
            }));
        } else {
            return Promise.reject(new Error('You have to be logged in, to edit your account.'));
        }
    }


    /**
     * UNTESTED
     * Updates the email address for a signed in user
     * @param newEmail: New email address
     */
    updateUserEmail(newEmail) {

        /* TODO: Update email address --> maybe verification necessary? */

    }

    /**
     * Deletes the currently logged in user
     * @returns Promise || firebase.Promise
     */
    deleteUser() {
        let user = firebaseApp.auth().currentUser;
        if(user) {
            return firebaseApp.database().ref('/users/' + user.uid).remove().then(() => {
                return user.delete();
            }).then(() => {
                this.user = null;
            });
        } else {
            return Promise.reject(new Error('You have to be logged in, to delete your account.'));
        }
    }


}

export default new UserStore();
