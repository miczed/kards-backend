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

    login(email, password) {
        firebaseApp.auth().signInWithEmailAndPassword(email, password).catch((error) => {
          // TODO: Add language support for error messages
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
           alert('Wrong password.');
          } else if (errorCode === 'auth/invalid-email') {
              alert('E-Mail Adress invalid');
          } else if (errorCode === 'auth/user-not-found') {
              alert('There is no user registered with this email address.');
          }
          else {
              alert(errorMessage);
          }
          console.log(error);
        });
    }

    logout() {
        firebaseApp.auth().signOut().then(action(() => {
            this.user = null;
        }), function(error) {
            console.log(error);
        });
    }

    /**
     * UNTESTED
     * Gets username, lastname and firstname for user ID in Firebase DB
     * @param uid
     */
    getUserInfo(uid) {
        firebaseApp.database().ref("users/" + uid).on("value", action((snapshot) => {
            this.username = snapshot.val().username;
            this.firstname = snapshot.val().firstname;
            this.lastname = snapshot.val().lastname;
        }));
    }

    /**
     * UNTESTED
     * Creates a new user and automatically logs the user in,
     * if the registration was sucessful ( onAuthStateChanged is called )
     * @param email
     * @param password
     * @param username
     */
    createNewUser(email,password,username, firstname, lastname) {
        firebaseApp.auth().createUserWithEmailAndPassword(email,password).then(action((user) => {

            // Set observable store values
            this.user = user;
            this.username = username;
            this.firstname = firstname;
            this.lastname = lastname;

            // Save information about user in Firebase
            let userInfoChanges = {
                username: username,
                firstname: firstname,
                lastname: lastname
            };
            this.updateUserInfo(userInfoChanges);

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
     * Updates the profile of a signed in user when a new account is created
     * @param userInfoChanges: Object which contains the fields that should be updated
     * @param password: Password from «New Account Form» is taken to verify the user again
     */
    updateUserInfo(userInfoChanges, password) {

        /*

        TODO: Reauthenticate with Firebase (This is mandatory due to Firebase)
        (--> take pw from form, no popup necessary)
        TODO: Save new information about user in users/uid in Firebase

        */

    }

    /**
     * UNTESTED
     * Updates the profile of a signed in user which is made on the profile settings page
     * @param userInfoChanges: Object which contains the fields that should be updated
     */
    updateUserInfo(userInfoChanges) {

        /*

         TODO: Reauthenticate with Firebase (This is mandatory due to Firebase)
         (--> take pw from form, no popup necessary)
         TODO: Save new information about user in users/uid in Firebase

         */

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

}

export default new UserStore();