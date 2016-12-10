'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by michaelziorjen on 08/12/16.
 */

var Categories = function () {
    function Categories(firebaseApp) {
        _classCallCheck(this, Categories);

        this.firebaseApp = firebaseApp;
        this.categoriesStore = [];
    }

    /**
     * Returns the firebase reference to all the categories
     * @returns {*} reference to the firebase object
     */


    _createClass(Categories, [{
        key: 'getCategoriesRef',
        value: function getCategoriesRef() {
            return this.firebaseApp.database().ref('categories');
        }

        /**
         * Returns the firebase reference to a single category
         * @param catKey : String key of the category
         * @returns {*} reference to the firebase object
         */

    }, {
        key: 'getCategoryRef',
        value: function getCategoryRef(catKey) {
            return this.firebaseApp.database().ref('categories/' + catKey);
        }

        /**
         * Returns the firebase reference to the progress
         * @returns {*} reference to the firebase object
         */

    }, {
        key: 'getProgressRef',
        value: function getProgressRef() {
            return this.firebaseApp.database().ref('progress');
        }

        /**
         * Gets all the categories that are children of the specified key's category
         * @param parentKey : String key of the parent category
         * @param callback : Function gets called when the promise is resolved
         */

    }, {
        key: 'getCategoriesByParent',
        value: function getCategoriesByParent() {
            var parentKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var callback = arguments[1];

            var ref = this.getCategoriesRef().orderByChild("parent").equalTo(parentKey);
            ref.once('value', function (snapshot) {
                var items = [];
                if (snapshot.val()) {
                    (function () {
                        var data = snapshot.val();
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
         * Gets a single category specified by it's key
         * @param catKey : String key of the category
         * @param callback : Function gets called when the promise is resolved
         */

    }, {
        key: 'getCategoryByKey',
        value: function getCategoryByKey(catKey, callback) {
            this.getCategoryRef(catKey).once('value').then(function (snapshot) {
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
         * Gets all the categories
         * @param callback : Function gets called when the promise is resolved
         */

    }, {
        key: 'getAllCategories',
        value: function getAllCategories(callback) {
            var ref = this.getCategoriesRef();
            ref.once('value', function (snapshot) {
                var _this = this;

                var items = [];
                if (snapshot.val()) {
                    (function () {
                        var data = snapshot.val();
                        _this.categoriesStore = data;
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
         * Helper function that merges X firebase objects together
         * all the attributes are merged.
         * @param base : object into which the data should be merged
         * @returns {*} merged object
         */

    }, {
        key: 'extend',
        value: function extend(base) {
            var parts = Array.prototype.slice.call(arguments, 1);
            parts.forEach(function (p) {
                if (p && (typeof p === 'undefined' ? 'undefined' : _typeof(p)) === 'object') {
                    for (var k in p) {
                        if (p.hasOwnProperty(k)) {
                            base[k] = p[k];
                        }
                    }
                }
            });
            return base;
        }

        /**
         * Helper function that merges two firebase objects the attributes are only merged if both objects contain the same keys
         * @param first : object into which the data should be merged
         * @param second : object from which the data should be taken
         * @returns {*} merged object
         */

    }, {
        key: 'leftJoin',
        value: function leftJoin(first, second) {
            for (var key in first) {
                if (first.hasOwnProperty(key)) {
                    if (second[key]) {
                        Object.assign(first[key], second[key]);
                    }
                }
            }
            return first;
        }

        /**
         * Returns the progress for each card in the specified category
         * @param catKey : String key for the category
         * @param callback : Function that gets called when promises are resolved
         */

    }, {
        key: 'getCategoryProgress',
        value: function getCategoryProgress(catKey, callback) {
            var _this2 = this;

            var progressRef = this.getProgressRef();
            var cardsRef = this.getCategoryRef(catKey).child('cards');
            cardsRef.once("value", function (cardsSnapshot) {
                if (cardsSnapshot.val()) {
                    progressRef.once("value", function (progressSnapshot) {
                        var progress = progressSnapshot.val();
                        var cards = cardsSnapshot.val();
                        var joint = _this2.leftJoin(cards, progress);
                        callback(joint);
                    });
                } else {
                    callback(null);
                }
            });
        }

        /**
         * Gets the progress for all cards in a specified category and groups them in an object with the following attributes:
         * - veryhard: 2 or more times wrong in a row
         * - hard: 1 time wrong in a row
         * - normal: zero or 1 time right in a row
         * - learned: two times right in a row
         * @param catKey : String key of the category
         * @param callback : function that gets called when the promise is resolved
         */

    }, {
        key: 'getCategoryProgressGroups',
        value: function getCategoryProgressGroups(catKey, callback) {
            this.getCategoryProgress(catKey, function (progress) {
                var veryhard = {};
                var hard = {};
                var normal = {};
                var learned = {};
                for (var key in progress) {
                    if (progress.hasOwnProperty(key)) {
                        if (progress[key].progress < -2) {
                            veryhard[key] = progress[key];
                        } else if (progress[key].progress == -1) {
                            hard[key] = progress[key];
                        } else if (progress[key].progress >= 2) {
                            learned[key] = progress[key];
                        } else {
                            // Progress is not set or zero
                            normal[key] = progress[key];
                        }
                    }
                    var progresses = { 'veryhard': veryhard, 'hard': hard, 'normal': normal, 'learned': learned };
                    callback(progresses);
                }
            });
        }
    }]);

    return Categories;
}();
//# sourceMappingURL=Categories.js.map