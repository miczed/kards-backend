import { expect } from 'chai';

import { SetStore, UserStore } from '../src/stores';

describe('Testing the SetStore', () => {
    const email = "setstore@knub.io";
    const password = "hulibuly";
    const username = "testuser";
    const firstname = "Max";
    const lastname = "Muster";
    const setTitle = "Testset";
    let setStore;
    let setKey;

    it('should create a new setStore and pass the userStore',() => {
        return UserStore.createNewUser(email,password,username, firstname, lastname).then((user) => {
            setStore = new SetStore(UserStore);
            expect(setStore.userStore, "SetStore is instantiated with UserStore").to.equal(UserStore);
        });
    });
    it('should create a new set for the user testing@knub.io',() => {
        return setStore.create(setTitle).then((set) => {
            expect(setStore.sets.size, "Set was successfully added to store").to.equal(1);
            expect(setStore.sets.get(set.key), "Set is accessible with its key").to.equal(set);
            expect(set.title, "Set title was successfully set.").to.equal(setTitle);
            expect(set.collaborators.get(UserStore.user.uid), "Creator was successfully added as collaborator to set").to.equal(true);
            expect(set.cards.size, "Cards map was successfully created").to.equal(0);
            expect(set.views, "Views were successfully set to zero").to.equal(0);
        })
    });
    it('should delete the set we created before', () => {
       return true;
    });

    // TODO: Write test for deleting
    // TODO: write test for updating
    // TODO: write test for adding / removing collaborators

    // Delete the user we created earlier
    UserStore.deleteUser();
});
