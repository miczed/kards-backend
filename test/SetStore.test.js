import { expect } from 'chai';

import { SetStore, UserStore } from '../src/stores';
import {observer} from 'mobx-react';
import {reaction } from 'mobx';

describe('Testing the SetStore', () => {
    const email = "setstore@knub.io";
    const password = "hulibuly";
    const username = "testuser";
    const firstname = "Max";
    const lastname = "Muster";
    const setTitle = "Testset";
    const newTitle = "Holy Guacamole!";

    const json = {
        title: "ChangedCard",
        views: 200,
        collaborators: { "abc" : true, "def" : true},
        cards: { "ghi" : true, "klm" : true },
        fork_of: "nopqrs",
    };

    let setStore;
    let globalSet;


    before(() => {
        return UserStore.createNewUser(email,password,username, firstname, lastname).then((user) => {
            setStore = new SetStore(UserStore);
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
            globalSet = setStore.sets.get(set.key);
            UserStore.getSetsRef().child(set.key).once("value",(snap) => {
                expect(snap.val(), "Set was not stored to user's firebase tree").to.equal(true);
            })
        })
    });
    it('should update the set based on another json object',() => {
        globalSet.updateFromJson(json);
        expect(globalSet.title, "Title was not updated correctly").to.equal(json.title);
        expect(globalSet.views, "Views was not updated correctly").to.equal(json.views);
        expect(globalSet.collaborators.size, "Collaborators map was not updated correctly").to.equal(Object.keys(json.collaborators).length);
        expect(globalSet.collaborators.size, "Cards map was not updated correctly").to.equal(Object.keys(json.cards).length);
        expect(globalSet.fork_of, "fork_of was not updated correctly").to.equal(json.fork_of);
    });
    it('should update the set on firebase when changed locally',() => {
        globalSet.title = newTitle;
        return setStore.getSingleRef(globalSet.key).once("value",(snap) => {
            const val = snap.val();
            expect(val.title, "Title was not updated correctly on firebase").to.equal(newTitle);
        })
    });
    it('should update the set locally when changed on firebase',() => {
        return setStore.getSingleRef(globalSet.key).update(json).then(() => {
            expect(globalSet.title, "Title was not updated correctly locally from firebase").to.equal(json.title);
        });
    });
    it('should delete the set we created before', () => {
       return setStore.remove(globalSet.key).then(() => {
            const setKey = globalSet.key;
            expect(setStore.sets.get(setKey), "Set was successfully deleted from store").to.equal(undefined);
            expect(globalSet, "Set was succesfully deleted from client");
            expect(setStore.sets.size, "Sets map is now empty").to.equal(0);
       });
    });
    after(() => {
        UserStore.deleteUser();
        return true;
    });

    // TODO: write test for adding / removing collaborators

});
