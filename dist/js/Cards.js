'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by michaelziorjen on 08/12/16.
 */
var Cards = function () {
    function Cards(firebaseApp) {
        _classCallCheck(this, Cards);

        this.firebaseApp = firebaseApp;
        this.cardsStore = [];
    }
    /**
     * Returns the firebase reference to all the cards
     * @returns {*} reference to the firebase object
     */


    _createClass(Cards, [{
        key: 'getCardsRef',
        value: function getCardsRef() {
            return this.firebaseApp.database().ref('cards');
        }
        /**
         * Returns the firebase reference to a single card
         * @param cardKey : String key of the card
         * @returns {*} reference to the firebase object
         */

    }, {
        key: 'getCardRef',
        value: function getCardRef(cardKey) {
            return this.firebaseApp.database().ref('cards/' + cardKey);
        }
        /**
         * Returns the firebase reference to the progress of a card
         * @param cardKey : String key of the card
         * @returns {*} reference to the firebase object
         */

    }, {
        key: 'getCardProgressRef',
        value: function getCardProgressRef(cardKey) {
            return this.firebaseApp.database().ref('progress/' + cardKey);
        }

        /**
         * Gets all the cards that are in the specified key's category
         * @param catKey : String key of the category
         * @param callback : Function gets called when the promise is resolved
         */

    }, {
        key: 'getCardsByCategory',
        value: function getCardsByCategory(catKey, callback) {
            this.getCardsRef().orderByChild('category').equalTo(catKey).once('value').then(function (snapshot) {
                var _this = this;

                var items = [];
                if (snapshot.val()) {
                    (function () {
                        var data = snapshot.val();
                        _this.cardsStore = data;
                        items = Object.keys(data).map(function (key) {
                            var obj = data[key];
                            obj._key = key;
                            return obj;
                        });
                    })();
                }
                callback(items);
            });
        }
        /**
         * Gets a single card specified by it's key
         * @param cardKey : String key of the card
         * @param callback : Function gets called when the promise is resolved
         */

    }, {
        key: 'getCardByKey',
        value: function getCardByKey(cardKey, callback) {
            this.getCardRef(cardKey).once('value').then(function (snapshot) {
                var item = void 0;
                if (snapshot.val()) {
                    var key = snapshot.val().key;
                    this.cardsStore[key] = snapshot.val();
                    item = snapshot.val();
                }
                callback(item);
            });
        }

        /**
         * Gets the progress of a card specified by it's key, gets 0 if no progress is set
         * @param cardKey : String key of the card
         * @param callback : Function that get called when promise is resolved
         */

    }, {
        key: 'getCardProgress',
        value: function getCardProgress(cardKey, callback) {
            var progressRef = this.getCardProgressRef(cardKey).child('progress');
            progressRef.once('value', function (snapshot) {
                var item = 0;
                if (snapshot.val()) {
                    item = snapshot.val();
                }
                callback(item);
            });
        }

        /**
         * Increases the progress of a card
         * @param cardKey : String key of the card
         */

    }, {
        key: 'increaseCardProgress',
        value: function increaseCardProgress(cardKey) {
            // TESTED
            var progressRef = this.getCardProgressRef(cardKey).child('progress');
            progressRef.transaction(function (current_value) {
                if (!current_value) {
                    return 1;
                }
                if (current_value <= 0) {
                    return 1;
                } else {
                    return current_value + 1;
                }
            });
        }
        /**
         * Decreases the progress of a card
         * @param cardKey : String key of the card
         */

    }, {
        key: 'decreaseCardProgress',
        value: function decreaseCardProgress(cardKey) {
            // TESTED
            var progressRef = this.getCardProgressRef(cardKey).child('progress');
            progressRef.transaction(function (current_value) {
                if (!current_value) {
                    return -1;
                }
                if (current_value >= 0) {
                    return -1;
                } else {
                    return current_value - 1;
                }
            });
        }

        /**
         * Resets the progress of a card to zero
         * @param cardKey : String key of the card
         */

    }, {
        key: 'resetCardProgress',
        value: function resetCardProgress(cardKey) {
            // TESTED
            var updates = {};
            updates['progress'] = 0;
            this.getCardProgressRef(cardKey).update(updates);
        }
    }]);

    return Cards;
}();
//# sourceMappingURL=Cards.js.map