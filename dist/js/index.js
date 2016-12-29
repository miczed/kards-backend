'use strict';

/**
 * Created by michaelziorjen on 21.11.16.
 */

var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], // toggled buttons
['blockquote', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript

/*[{ 'header': [1, 2, false] }],*/

[{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme

['formula', 'image', 'video'], ['clean'] // clean styling button

];

var front = new Quill('#front-editor', {
    modules: { formula: true, toolbar: toolbarOptions },
    theme: 'snow'
});

var back = new Quill('#back-editor', {
    modules: { formula: true, toolbar: toolbarOptions },
    theme: 'snow'
});

var cardsProvider = new Cards(firebase);
var categoriesProvider = new Categories(firebase);

categoriesProvider.getCategoryProgressGroups('-KYYx9Sgp9KGbzhLENdk', function (joint) {
    // //-KXuyoLUPxH-XGIDZkIY
    console.log(joint);
});

// Global cards store
var cardsStore = []; // Stores all cards locally in the browser (later via localstorage)
var categoriesStore = []; // Stores all categories locally in the browser (later via localstorage)
var cardRef = void 0; // The currently selected card
var cardsRef = firebase.database().ref('cards'); // The reference to ALL the cards
var categoryRef = void 0; // The currently selected category
var categoriesRef = firebase.database().ref('categories'); // Reference to ALL the categories

/**
 * Called initially and whenever firebase detects a change on a cards object
 */
/*cardsRef.on('value', function(snapshot) {
    let data = snapshot.val();
    cardsStore = snapshot.val(); // Store returned data in global cards store
    let dataWithKeys = Object.keys(data).map((key) => {
        let obj = data[key];
        obj._key = key;
        return obj;
    });
    updateCardsList(dataWithKeys);
});*/

/**
 * Called initially and whenever firebase detects a change on a category object
 */
categoriesRef.on("value", function (snapshot) {

    var data = snapshot.val();
    categoriesStore = data;
    var dataWithKeys = [];
    if (data != null) {
        dataWithKeys = Object.keys(data).map(function (key) {
            var obj = data[key];
            obj._key = key;
            obj.children = [];
            return obj;
        });
    }
    var tree = buildTree(dataWithKeys);
    deleteChildren(document.getElementById("categories-list"));
    buildUlTree(tree, document.getElementById("categories-list"));

    updateCategoriesSelect(tree, document.getElementById("card-category"));
    updateCategoriesSelect(tree, document.getElementById("category-parent"));
});

/**
 * helper function to remove all children inside a DOM element
 * @param elem : Element whose children should be removed
 */
function deleteChildren(elem) {
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.firstChild);
    }
}

/**
 * Builds a tree from a flat array
 * @pre data objects must have empty children property children
 * @pre data objects parent property must point to the key of the parent or be empty
 * @param data : Array of objects
 * @returns Array
 */
function buildTree(data) {
    var dataMap = {};
    data.forEach(function (node) {
        dataMap[node._key] = node;
    });

    // create the tree array
    var tree = [];
    data.forEach(function (node) {
        // find parent
        var parent = dataMap[node.parent];
        if (parent) {
            // create child array if it doesn't exist
            (parent.children || (parent.children = [])).
            // add node to parent's child array
            push(node);
        } else {
            // parent is null or missing
            tree.push(node);
        }
    });
    return tree;
}
/**
 * Renders a SELECT tree recursively
 * @param obj : object that should be rendered (must be a tree with children attribute)
 * @param elem : Element in which the object should be rendered
 * @param indent : string that is in the beginning of the title output
 */
function buildSelectTree(obj, elem, indent) {
    if (!obj) {
        return;
    }

    for (var i = 0; i < obj.length; i++) {
        var node = document.createElement("OPTION");
        var title = document.createTextNode(indent + " " + obj[i].title);
        node.setAttribute("value", obj[i]._key);
        node.appendChild(title);
        elem.appendChild(node);
        if (cardRef && obj[i]._key == cardsStore[cardRef.key].category) {
            node.setAttribute("selected", "selected");
        }
        if (obj[i].children) {
            buildSelectTree(obj[i].children, elem, indent + "--");
        }
    }
}

/**
 * Renders a UL - LI tree recursively
 * @param obj : object that should be rendered (should be a tree with children attribute)
 * @param elem : Element in which the object should be rendered
 */
function buildUlTree(obj, elem) {
    if (!obj || obj.length == 0) {
        return;
    }
    var ul = document.createElement("UL");

    for (var i = 0; i < obj.length; i++) {
        var node = document.createElement("LI");
        var wrapper = document.createElement("DIV");

        var cardCount = 0;
        if (obj[i].cards) {
            cardCount = Object.keys(obj[i].cards).length;
        }

        var button = document.createElement("BUTTON");
        var button_icon = document.createElement("SPAN");
        button_icon.setAttribute("class", "icon-pencil");
        button.appendChild(button_icon);

        button.setAttribute("data-key", obj[i]._key);
        wrapper.setAttribute("data-key", obj[i]._key);
        button.setAttribute("class", "transparent");

        var div = document.createElement("DIV");
        $(div).text(obj[i].title);
        $(div).addClass('title');

        $(wrapper).append(div);

        wrapper.appendChild(button);

        if (obj[i].children && obj[i].children.length == 0) {
            var pill = document.createElement("SPAN");
            var pill_text = document.createTextNode(cardCount);
            pill.appendChild(pill_text);
            pill.setAttribute("class", "pill");
            wrapper.appendChild(pill);

            wrapper.addEventListener("click", function () {
                $('#categories-list .active').toggleClass('active');
                $(this).find('.title').addClass('active');
                var key = this.getAttribute("data-key");
                categoryRef = firebase.database().ref('categories/' + key);
                loadCardsList(key);
                return true;
            });
        } else {
            // is parent object
            $(div).on('click', function () {
                $(this).parent().siblings("ul").slideToggle('fast');
            });
        }

        button.addEventListener("click", function () {
            loadCategory(this.getAttribute("data-key"));
            return true;
        });

        node.appendChild(wrapper);

        if (obj[i].children && obj[i].children.length > 0) {
            buildUlTree(obj[i].children, node);
            $(node).find('ul').toggle();
        }
        $(wrapper).addClass('category-wrapper');

        ul.appendChild(node);

        // Category is currently selected
        if (categoryRef && obj[i]._key == categoryRef.key) {
            $(div).addClass('active');
            $(ul).toggle();
        }
    }
    elem.appendChild(ul);
}

/**
 * Gets the cards from the specified category and displays them in the DOM
 * @param key : Key of the category
 */
function loadCardsList(key) {
    // Delete existing list in DOM
    var cardsListElem = document.getElementById("cards-list");
    while (cardsListElem.hasChildNodes()) {
        cardsListElem.removeChild(cardsListElem.firstChild);
    }

    // Show loader
    $("#cards-loader").fadeIn('fast');

    //load cards from server
    loadCardsByCategory(key, function (cardsList) {
        // hide loader
        $("#cards-loader").fadeOut('fast');

        // populate DOM with data
        if (cardsList) {
            for (var i = 0; i < cardsList.length; i++) {
                var node = document.createElement("LI");
                var title = document.createTextNode(cardsList[i].title);

                node.setAttribute("data-key", cardsList[i]._key);

                node.appendChild(title);
                if (cardRef && cardRef.key == cardsList[i]._key) {
                    // Card is selected
                    $(node).addClass('active');
                }
                node.addEventListener("click", function () {
                    $('#cards-list .active').toggleClass('active');
                    $(this).addClass('active');
                    loadCard(this.getAttribute("data-key"));
                    return true;
                });

                cardsListElem.appendChild(node);
            }
        } else {
            $(cardsListElem).append('<li class="empty-state">Keine Karten</li>');
        }
    });
}

/**
 * Updates a single SELECT DOM element with the list of categories
 * @param categoriesList : Array
 * @param elem : Element SELECT DOM element
 */
function updateCategoriesSelect(categoriesList, elem) {
    if (elem) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
        // Add empty node on top
        var node = document.createElement("OPTION");
        var title = document.createTextNode("-- nichts ausgewählt --");
        node.appendChild(title);
        node.setAttribute("value", "");
        elem.appendChild(node);

        buildSelectTree(categoriesList, elem, "");
    }
}
/**
 * Gets the cards from firebase that belong to the specified category
 * @param categoryKey : String
 * @param callback : Function which gets executed, when the promise is resolved
 * @return Array list of cards
 */
function loadCardsByCategory(categoryKey, callback) {
    firebase.database().ref('cards').orderByChild('category').equalTo(categoryKey).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            (function () {
                var data = snapshot.val();
                cardsStore = snapshot.val(); // Store returned data in global cards store
                var dataWithKeys = Object.keys(data).map(function (key) {
                    var obj = data[key];
                    obj._key = key;
                    return obj;
                });
                callback(dataWithKeys);
            })();
        } else {
            callback(null);
        }
    });
}

/**
 * Loads the card into the corresponding DOM fields and prepares it for editing
 * @param key: String the firebase key of the card
 */
function loadCard(key) {
    showCardContainer();
    var card = cardsStore[key];
    cardRef = firebase.database().ref('cards/' + key);
    document.getElementById("card-title").value = card.title;
    document.getElementById("card-category").value = card.category;
    front.setContents(card.front_delta);
    back.setContents(card.back_delta);
}

/**
 * Loads the category into the corresponding DOM fields and prepares it for editing
 * @param key: String the firebase key of the category
 */
function loadCategory(key) {
    showCategoryContainer();
    var category = categoriesStore[key];
    categoryRef = firebase.database().ref('categories/' + key);
    document.getElementById("category-title").value = category.title;
    document.getElementById("category-parent").value = category.parent;
}
/**
 * Shows the card container and hides the categories container
 */
function showCardContainer() {
    $('#category').fadeOut('fast');
    $("#card").fadeIn('fast');
}

/**
 * Shows the category container and hides the card container
 */
function showCategoryContainer() {
    $('#category').fadeIn('fast');
    $("#card").fadeOut('fast');
}

/**
 * Saves the currently loaded card to firebase. Works both with update and create
 * @pre: cardRef has to be set if card should be updated, otherwise a new card is created
 * @post: cardRef is set to the updated / created card
 */
function saveCard() {
    var title = document.getElementById("card-title").value;
    var cat = document.getElementById("card-category").value;
    if (title && cat) {
        if (cardRef == null) {
            // Neue Karte wird erstellt
            cardRef = firebase.database().ref('cards').push();
        }

        // Delete from old category when category is changed
        if (cardsStore[cardRef.key]) {
            var oldCategory = cardsStore[cardRef.key].category;
            if (oldCategory != cat) {
                firebase.database().ref('categories/' + oldCategory + "/cards/" + cardRef.key).remove();
            }
        }
        cardRef.set({
            front_delta: front.getContents(),
            front_html: document.querySelector("#front-editor .ql-editor").innerHTML,
            back_delta: back.getContents(),
            back_html: document.querySelector("#back-editor .ql-editor").innerHTML,
            title: title,
            category: cat,
            modifiedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(function () {
            // TODO: add some sort of notification
        });

        // Set cards obj in categories
        var cardKey = cardRef.key;
        var catRef = firebase.database().ref("categories/" + cat + "/cards/" + cardKey);
        var updatedObj = {};
        updatedObj[cardKey] = true;
        catRef.update(updatedObj);

        cardRef = firebase.database().ref('cards/' + cardRef.key);
        loadCardsList(cat); // update dom list
    } else {
        window.alert("Bitte gib einen Titel und eine Kategorie für die Karte an.");
    }
}
/**
 * Resets the DOM fields and the cardRef so a new blank card can be created
 * @post: cardRef points to null
 */
function initCard(event) {
    showCardContainer();
    cardRef = null;

    if (categoryRef) {
        document.getElementById("card-category").value = categoryRef.key;
        console.log(categoryRef.key);
    } else {
        document.getElementById("card-category").value = "";
    }
    document.getElementById("card-title").value = "";

    front.setText("");
    back.setText("");
}
/**
 * Resets the DOM fields and the categoryRef so a new blank category can be created
 * @post: categoryRef points to null
 */
function initCategory() {
    showCategoryContainer();
    categoryRef = null;
    document.getElementById("category-title").value = "";
    document.getElementById("category-parent").value = "";
}

/**
 * The currently loaded card is deleted
 * @pre: cardRef should point to the card that should be deleted
 * @post: cardRef is set to null
 */
function deleteCard() {
    if (cardRef != null) {
        var cardKey = cardRef.key;
        var cat = cardsStore[cardKey].category;
        var card = cardsStore[cardKey];
        var answer = window.confirm("Möchtest du die Karte " + card.title + " wirklich löschen?");
        if (answer == true) {
            var catRef = firebase.database().ref("categories/" + cat + "/cards/" + cardKey);
            var updatedObj = {};
            updatedObj[cardKey] = null;
            catRef.update(updatedObj);
            cardRef.remove();
            initCard();
            loadCardsList(categoryRef.key);
        }
    } else {
        window.alert("Bitte wähle eine Karte aus, welche du löschen willst.");
    }
}
/**
 * The currently loaded category and ALL it's cards are deleted
 * @pre: categoryRef should point to the card that should be deleted
 * @post: categoryRef is set to null
 */
function deleteCategory() {
    if (categoryRef != null) {

        var cat = categoriesStore[categoryRef.key];
        var cardCount = void 0;
        if (cat.cards) {
            console.log(cat.cards);
            cardCount = Object.keys(cat.cards).length;
        } else {
            cardCount = 0;
        }
        var answer = window.confirm("Möchtest du die Kategorie " + cat.title + " und ALLE ihre " + cardCount + " zugeordneten Karten wirklich löschen?");
        if (answer == true) {
            var deletedObjs = {};
            for (var key in cat.cards) {
                if (cat.cards.hasOwnProperty(key)) {
                    deletedObjs[key] = null;
                }
            }
            var cardsRoot = firebase.database().ref("cards");
            console.log(deletedObjs);
            cardsRoot.update(deletedObjs);
            categoryRef.remove();
            initCategory();
        }
    } else {
        window.alert("Bitte wähle eine Kategorie aus, welche du löschen willst.");
    }
}

/**
 * Saves the currently loaded category to firebase. Works both with update and create
 * @pre: categoryRef has to be set if category should be updated, otherwise a new category is created
 * @post: categoryRef is set to the updated / created category
 */
function saveCategory() {
    var title = document.getElementById("category-title").value;
    var parent = document.getElementById("category-parent").value;
    if (parent == '') {
        parent = null;
    }
    if (title) {
        if (categoryRef && categoryRef.key == parent) {
            window.alert("Die Kategorie kann sich nicht selbst als Oberkategorie haben.");
            return;
        }
        if (categoryRef == null) {
            categoryRef = firebase.database().ref('categories').push();
        }

        var updatedObj = {};
        updatedObj["title"] = title;
        updatedObj["parent"] = parent;
        categoryRef.update(updatedObj);
        categoryRef = firebase.database().ref('categories/' + categoryRef.key);
    } else {
        window.alert("Bitte gib einen Titel für die Kategorie an.");
    }
}

/* Listener attachments */
var saveCardButton = document.getElementById("card-controls-save");
saveCardButton.addEventListener("click", saveCard);

document.getElementById("card-controls-new").addEventListener("click", initCard);
document.getElementById("cards-new").addEventListener("click", initCard);
$('#cards-new').on('click', function () {
    $('#cards-list .active').toggleClass('active');
    initCard();
});

document.getElementById("category-controls-new").addEventListener("click", initCategory);
document.getElementById("categories-new").addEventListener("click", initCategory);

var deleteCardButton = document.getElementById("card-controls-delete");
deleteCardButton.addEventListener("click", deleteCard);

var saveCategoryButton = document.getElementById("category-controls-save");
saveCategoryButton.addEventListener("click", saveCategory);

var deleteCategoryButton = document.getElementById("category-controls-delete");
deleteCategoryButton.addEventListener("click", deleteCategory);
//# sourceMappingURL=index.js.map