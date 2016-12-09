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
     * Helper function that merges two firebase objects with the same key together
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
     * Returns the progress for each card in the specified category
     * @param catKey : String key for the category
     * @param callback : Function that gets called when promises are resolved
     */
    getCategoryProgress(catKey, callback) {
        let progressRef = this.getProgressRef();
        let cardsRef = this.getCategoryRef(catKey).child('cards');
        cardsRef.once("value", (cardsSnapshot) => {
            progressRef.once("value",(progressSnapshot) => {
                let joint = this.extend({},cardsSnapshot.val(),progressSnapshot.val());
                callback(joint);
            });
        });
    }

    getCategoryProgressGroups(catKey, callback) {
        this.getCategoryProgress(catKey,(progress)=> {
            let veryhard = [];
            let hard = [];
            let normal = [];
            let learned = [];
            for (let property in progress) {
                if (progress.hasOwnProperty(property)) {
                    if(property.progress < -2) {
                        veryhard.push(property);
                    } else if(property.progress == -1 ) {
                        hard.push(property);
                    } else if (property.progress >= 2) {
                        learned.push(property);
                    } else  {
                        normal.push(property);
                    }
                }
                let progresses = { 'veryhard': veryhard, 'hard': hard,'normal': normal, 'learned': learned};
                callback(progresses);
            }
        })
    }

}