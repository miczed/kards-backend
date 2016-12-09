"use strict";

/**
 * Created by michaelziorjen on 09.12.16.
 */
describe("The Cards class is tested", function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCZZgxh3tDa8OAFJCKCHRj_8q3JW2FW0Ho",
        authDomain: "kards-90223.firebaseapp.com",
        databaseURL: "https://kards-90223.firebaseio.com",
        storageBucket: "kards-90223.appspot.com",
        messagingSenderId: "600593412749"
    };
    var firebaseApp = firebase.initializeApp(config);

    var cardsProvider = new Cards(firebaseApp);

    var cardKey = 'test';

    it("Increasing Progress", function () {
        // TODO: write unit test for this stuff
    });
});
//# sourceMappingURL=Cards.test.js.map