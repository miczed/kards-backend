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
}