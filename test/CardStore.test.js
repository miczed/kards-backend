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
        title: "ChangedCard",
        views: 200,
        collaborators: { "abc" : true, "def" : true},
        cards: { "ghi" : true, "klm" : true },
        fork_of: "nopqrs",
    };

    let setStore;
    let globalSet:Set;
    let cardStore;


    before((done) => {
        UserStore.createNewUser(email,password,username, firstname, lastname).then((user) => {
            setStore = new SetStore(UserStore);
            setStore.create(setTitle).then((set:Set) => {
                globalSet = set;
                cardStore = new CardStore(set.key,UserStore,setStore);
                console.log("Finished preparing test.");
                done();
            })
        });
    });

    it('should create a new card for the user testing@knub.io in the set' ,() => {
        return cardStore.create(cardTitle,cardFrontDelta,cardFrontHtml,cardBackDelta,cardBackHtml).then((card:Card) => {
            expect(cardStore.cards.size, "Set wasn't added to store").to.equal(1);
            expect(cardStore.cards.get(card.key), "Set is not accessible with its key").to.equal(card);
            expect(card.title, "Set title was not set.").to.equal(cardTitle);
            expect(card.front_delta, "Card front_delta wasn't set.").to.be.a('object')
            expect(card.front_html, "Card front_html wasn't set.").to.equal(cardFrontHtml);
            expect(card.back_delta, "Card back_delta wasn't set.").to.be.a('object')
            expect(card.back_html, "Card front_delta wasn't set.").to.equal(cardBackHtml);
            expect(card.collaborators.get(UserStore.user.uid), "Creator wasn't added as collaborator to card").to.equal(true);
            expect(card.views, "Views were not set to zero").to.equal(0);

        })
    });
    after(() => {
        setStore.remove(globalSet.key);
        UserStore.deleteUser();
        console.log('just cleaning up here...');
        return true;
    });

    // TODO: write test for adding / removing collaborators

});
