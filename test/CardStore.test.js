import { expect } from 'chai';

import { SetStore, UserStore,CardStore } from '../src/stores';
import {observer} from 'mobx-react';
import {reaction } from 'mobx';

describe.only('Testing the CardStore', () => {
    const email = "cardstore@knub.io";
    const password = "hulibuly";
    const username = "testuser";
    const firstname = "Max";
    const lastname = "Muster";

    const setTitle = "Testset";

    const cardTitle = "Testcard";
    const cardFrontDelta = {};
    const cardFrontHtml = "<b>Front</b>";
    const cardBackDelta = {};
    const cardBackHtml = "<i>Back</i>";

    const newTitle = "Holy Guacamole!";

    const json = {
        title: "Observer Design Pattern",
        front_delta: {},
        front_html : "<i>Front</i>",
        back_delta : {},
        back_html : "<b>Back</b>",
        collaborators : {
            "user1_key" : true,
            "user2_key": true
        },
        views : 120,
        fork_of : "card1_key",
    };

    let setStore;
    let globalSet:Set;
    let cardStore;
    let globalCard:Card;


    before(() => {
        return UserStore.createNewUser(email,password,username, firstname, lastname).then((user) => {
            setStore = new SetStore(UserStore);
            console.log('created a new user');
        })
    });
    before(() => {
        return setStore.create(setTitle).then((set:Set) => {
            globalSet = set;
            cardStore = new CardStore(set.key,UserStore,setStore);
            console.log("Finished preparing test.");
        });
    });
    describe('Creating & updating a Card', (done) => {
        it('should create a new card for the user '+ email + ' in the set' ,() => {
            cardStore.create(cardTitle,cardFrontDelta,cardFrontHtml,cardBackDelta,cardBackHtml).then((card:Card) => {
                expect(cardStore.cards.size, "Set wasn't added to store").to.equal(1);
                expect(cardStore.cards.get(card.key), "Set is not accessible with its key").to.equal(card);
                expect(card.title, "Set title was not set.").to.equal(cardTitle);
                expect(card.front_delta, "Card front_delta wasn't set.").to.be.a('object');
                expect(card.front_html, "Card front_html wasn't set.").to.equal(cardFrontHtml);
                expect(card.back_delta, "Card back_delta wasn't set.").to.be.a('object');
                expect(card.back_html, "Card front_delta wasn't set.").to.equal(cardBackHtml);
                expect(card.views, "Views were not set to zero").to.equal(0);
                expect(card.collaborators.get(UserStore.user.uid), "Creator was not successfully added as collaborator to card").to.equal(true);
                globalCard = cardStore.cards.get(card.key);
                done();
            })
        });
        /*it('should update the set based on another json object',() => {
            expect(globalCard).to.be.a('object');
            globalCard.updateFromJson(json);
            expect(globalCard.title, "Title was not updated correctly").to.equal(json.title);
            expect(globalCard.views, "Views was not updated correctly").to.equal(json.views);
            expect(globalCard.front_delta,"Front Delta was not updated correctly").to.equal(json.front_delta);
            expect(globalCard.back_delta,"Back Delta was not updated correctly").to.equal(json.back_delta);
            expect(globalCard.front_html,"Front HTML was not updated correctly").to.equal(json.front_html);
            expect(globalCard.back_html,"Back HTML was not updated correctly").to.equal(json.back_html);
            expect(globalSet.collaborators.size, "Collaborators map was not updated correctly").to.equal(Object.keys(json.collaborators).length);
            expect(globalSet.collaborators.size, "Cards map was not updated correctly").to.equal(Object.keys(json.cards).length);
            expect(globalSet.fork_of, "fork_of was not updated correctly").to.equal(json.fork_of);
        });*/
    });
    after(() => {
        if(globalSet) {
            setStore.remove(globalSet.key);
        }

        UserStore.deleteUser();
        console.log('just cleaning up here...');
        return true;
    });

    // TODO: write test for adding / removing collaborators

});
