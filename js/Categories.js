/**
 * Created by michaelziorjen on 08/12/16.
 */

class Categories {
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
        this.categoriesStore = [];
    }

    /**
     * Returns the firebase reference to all the categories
     * @returns {*} reference to the firebase object
     */
    getCategoriesRef() {
        return this.firebaseApp.database().ref('categories');
    }

    /**
     * Returns the firebase reference to a single category
     * @param catKey : String key of the category
     * @returns {*} reference to the firebase object
     */
    getCategoryRef(catKey) {
        return this.firebaseApp.database().ref('categories/' + catKey);
    }

    /**
     * Returns the firebase reference to the progress
     * @returns {*} reference to the firebase object
     */
    getProgressRef() {
        return this.firebaseApp.database().ref('progress');
    }

    /**
     * Gets all the categories that are children of the specified key's category
     * @param parentKey : String key of the parent category
     * @param callback : Function gets called when the promise is resolved
     */
    getCategoriesByParent(parentKey = "", callback) {
        let ref = this.getCategoriesRef().orderByChild("parent").equalTo(parentKey);
        ref.once('value',function(snapshot) {
            let items = [];
            if(snapshot.val()) {
                let data = snapshot.val();
                items = Object.keys(data).map((key) => {
                    let obj = data[key];
                    obj._key = key;
                    return obj;
                });
            }
            callback(items);
        });
    }
    /**
     * Gets a single category specified by it's key
     * @param catKey : String key of the category
     * @param callback : Function gets called when the promise is resolved
     */
    getCategoryByKey(catKey,callback) {
        this.getCategoryRef(catKey).once('value').then(function(snapshot) {
            let item;
            if(snapshot.val()) {
                let key = snapshot.val().key;
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
    getAllCategories(callback) {
        let ref = this.getCategoriesRef();
        ref.once('value',function(snapshot) {
            let items = [];
            if(snapshot.val()) {
                let data = snapshot.val();
                this.categoriesStore = data;
                items = Object.keys(data).map((key) => {
                    let obj = data[key];
                    obj._key = key;
                    return obj;
                });
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
    extend(base) {
        const parts = Array.prototype.slice.call(arguments, 1);
        parts.forEach(function (p) {
            if (p && typeof (p) === 'object') {
                for (let k in p) {
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
    leftJoin(first,second) {
        for (let key in first) {
            if (first.hasOwnProperty(key)) {
                if(second[key]) {
                    Object.assign(first[key],second[key]);
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
    getCategoryProgress(catKey, callback) {
        let progressRef = this.getProgressRef();
        let cardsRef = this.getCategoryRef(catKey).child('cards');
        cardsRef.once("value", (cardsSnapshot) => {
            if(cardsSnapshot.val()) {
                progressRef.once("value",(progressSnapshot) => {
                    let progress = progressSnapshot.val();
                    let cards = cardsSnapshot.val();
                    let joint = this.leftJoin(cards,progress);
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
    getCategoryProgressGroups(catKey, callback) {
        this.getCategoryProgress(catKey,(progress)=> {
            let veryhard = {};
            let hard = {};
            let normal = {};
            let learned = {};
            for (let key in progress) {
                if (progress.hasOwnProperty(key)) {
                    if(progress[key].progress < -2) {
                        veryhard[key] = progress[key];
                    } else if(progress[key].progress == -1 ) {
                        hard[key] = progress[key];
                    } else if (progress[key].progress >= 2) {
                        learned[key] = progress[key];
                    } else { // Progress is not set or zero
                        normal[key] = progress[key];
                    }
                }
                let progresses = { 'veryhard': veryhard, 'hard': hard,'normal': normal, 'learned': learned};
                callback(progresses);
            }
        })
    }

}