/**
 * Created by michaelziorjen on 08/12/16.
 */
class Cards {
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
        this.cardsStore = [];
    }
    /**
     * Returns the firebase reference to all the cards
     * @returns {*} reference to the firebase object
     */
    getCardsRef() {
        return this.firebaseApp.database().ref('cards');
    }
    /**
     * Returns the firebase reference to a single card
     * @param cardKey : String key of the card
     * @returns {*} reference to the firebase object
     */
    getCardRef(cardKey) {
        return this.firebaseApp.database().ref('cards/' + cardKey);
    }

    /**
     * Gets all the cards that are in the specified key's category
     * @param catKey : String key of the category
     * @param callback : Function gets called when the promise is resolved
     */
    getCardsByCategory(catKey,callback) {
        this.getCardsRef().orderByChild('category').equalTo(catKey).once('value').then(function(snapshot) {
            let items = [];
            if(snapshot.val()) {
                let data = snapshot.val();
                this.cardsStore = data;
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
     * Gets a single card specified by it's key
     * @param cardKey : String key of the card
     * @param callback : Function gets called when the promise is resolved
     */
    getCardByKey(cardKey, callback) {
        this.getCardRef(cardKey).once('value').then(function(snapshot) {
            let item;
            if(snapshot.val()) {
                let key = snapshot.val().key;
                this.cardsStore[key] = snapshot.val()
                item = snapshot.val();
            }
            callback(item);
        });
    }
}