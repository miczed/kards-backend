import { expect } from 'chai';

import UserStore from '../src/stores/UserStore.jsx';

describe('Testing the UserStore', () => {
    const email = "userstore@knub.io";
    const password = "hulibuly";
    const username = "testuser";
    const firstname = "Max";
    const lastname = "Muster";

    it('should create new user correctly', () => {
        return UserStore.createNewUser(email,password,username, firstname, lastname).then(() => {
            expect(UserStore.user).to.not.equal(null);
            expect(UserStore.username, "Username is set correctly").to.equal(username);
            expect(UserStore.lastname, "Lastname is set correctly").to.equal(lastname);
            expect(UserStore.firstname, "Firstname is set correctly").to.equal(firstname);
        });
    });
    it('should prevent creating another user with same email',() => {
        return UserStore.createNewUser(email,password,username, firstname, lastname).catch((error) => {
            expect(error.code).to.equal("auth/email-already-in-use");
        });
    });
    it('should logout user', () => {
        return UserStore.logout().then(() => {
           expect(UserStore.user).to.equal(null);
        });
    })
    it('should login user and get the profile', () => {
       return UserStore.login(email, password).then(() => {
          expect(UserStore.user).to.not.equal(null);
          expect(UserStore.username, "Username is loaded correctly").to.equal(username);
          expect(UserStore.lastname, "Lastname is loaded correctly").to.equal(lastname);
          expect(UserStore.firstname, "Firstname is loaded correctly").to.equal(firstname);
       });
    });
    it('should delete created user', () => {
       return UserStore.deleteUser().then(() => {
          expect(UserStore.user).to.equal(null);
       });
    });
});
