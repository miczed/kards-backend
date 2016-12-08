'use strict';

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
    }]);

    return Categories;
}();
//# sourceMappingURL=Categories.js.map