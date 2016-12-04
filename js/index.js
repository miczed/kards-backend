/**
 * Created by michaelziorjen on 21.11.16.
 */


const front = new Quill('#front-editor', {
    modules: { toolbar: '#front-toolbar' },
    theme: 'snow'
});

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

    [{ 'header': [1, 2, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],

    ['formula','image','video']

];


const back = new Quill('#back-editor', {
    modules: { formula: true, toolbar: toolbarOptions },
    theme: 'snow'
});

// Global cards store
let cardsStore = [];
let categoriesStore = [];
let cardRef;
let cardsRef = firebase.database().ref('cards');
let categoryRef;
let categoriesRef = firebase.database().ref('categories');

cardsRef.on('value', function(snapshot) {
    let data = snapshot.val();
    cardsStore = snapshot.val(); // Store returned data in global cards store
    let dataWithKeys = Object.keys(data).map((key) => {
        let obj = data[key];
        obj._key = key;
        return obj;
    });
    updateCardsList(dataWithKeys);
});

categoriesRef.on("value", function(snapshot) {
    let data = snapshot.val();
    categoriesStore = data;
    let dataWithKeys = [];
    if(data != null) {
        dataWithKeys = Object.keys(data).map((key) => {
            let obj = data[key];
            obj._key = key;
            return obj;
        });
    }
    updateCategoriesList(dataWithKeys, document.getElementById("categories-list"));
    const dummy = { _key: "", title: "-- keine Kategorie --"};
    dataWithKeys.unshift(dummy);
    updateCategoriesSelect(dataWithKeys, document.getElementById("card-category"));
    updateCategoriesSelect(dataWithKeys, document.getElementById("category-parent"));
});

function updateCardsList(cardsList) {
    const cardsListElem = document.getElementById("cards-list");
    while (cardsListElem.hasChildNodes()) {
        cardsListElem.removeChild(cardsListElem.firstChild);
    }

    for(let i = 0; i < cardsList.length; i++) {
        let node = document.createElement("LI");
        let title = document.createTextNode(cardsList[i].title);
        node.setAttribute("data-key",cardsList[i]._key);
        node.appendChild(title);
        node.addEventListener("click",function() {
           loadCard(this.getAttribute("data-key"));
           return true;
        });
        cardsListElem.appendChild(node);
    }
}

function updateCategoriesList(categoriesList, elem) {
    if(elem) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
        for (let i = 0; i < categoriesList.length; i++) {
            let node = document.createElement("LI");
            let title = document.createTextNode(categoriesList[i].title);
            node.setAttribute("data-key", categoriesList[i]._key);
            node.appendChild(title);
            node.addEventListener("click", function () {
                loadCategory(this.getAttribute("data-key"));
                return true;
            });
            elem.appendChild(node);
        }
    }
}

function updateCategoriesSelect(categoriesList, elem) {
    if(elem) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
        for(let i = 0; i < categoriesList.length; i++) {
            let node = document.createElement("OPTION");
            let title = document.createTextNode(categoriesList[i].title);
            node.setAttribute("value",categoriesList[i]._key);
            node.appendChild(title);
            elem.appendChild(node);
        }
    }
}


function loadCard(key) {
    let card = cardsStore[key];
    cardRef = firebase.database().ref('cards/' + key);
    document.getElementById("card-title").value = card.title;
    document.getElementById("card-category").value = card.category;
    front.setContents(card.front_delta);
    back.setContents(card.back_delta);
}

function loadCategory(key) {
    let category = categoriesStore[key];
    categoryRef = firebase.database().ref('categories/' + key);
    document.getElementById("category-title").value = category.title;
    document.getElementById("category-parent").value = category.parent;
}

function saveCard() {
    const title = document.getElementById("card-title").value;
    const cat = document.getElementById("card-category").value;
    if(title && cat) {
        if(cardRef == null) { // Neue Karte wird erstellt
            cardRef = firebase.database().ref('cards').push()
        }
        cardRef.set({
            front_delta: front.getContents(),
            front_html: document.querySelector("#front-editor .ql-editor").innerHTML,
            back_delta: back.getContents(),
            back_html: document.querySelector("#back-editor .ql-editor").innerHTML,
            title: title,
            category: cat
        });

        // Set cards obj in categories
        const cardKey = cardRef.key;
        const catRef = firebase.database().ref("categories/" + cat + "/cards/" + cardKey);
        let updatedObj = {};
        updatedObj[cardKey] = true;
        catRef.update(updatedObj);

        cardRef = firebase.database().ref('cards/' + cardRef.key);
    } else {
        window.alert("Bitte gib einen Titel und eine Kategorie für die Karte an.");
    }
}

function initCard() {
    cardRef = null;
    document.getElementById("card-title").value = "";
    document.getElementById("card-category").value = "";
    front.setText("");
    back.setText("");
}

function initCategory() {
    categoryRef = null;
    document.getElementById("category-title").value = "";
    document.getElementById("category-parent").value = "";
}

function deleteCard() {
    if(cardRef != null) {
        const cardKey = cardRef.key;
        const cat = cardsStore[cardKey].category;
        let catRef = firebase.database().ref("categories/" + cat + "/cards/" + cardKey);
        let updatedObj = {};
        updatedObj[cardKey] = null;
        catRef.update(updatedObj);
        cardRef.remove();
        initCard();
    }
}

function deleteCategory() {
    if(categoryRef != null) {
        const cat = categoriesStore[categoryRef.key];
        let deletedObjs = {}
        for (let key in cat.cards) {
            if (cat.cards.hasOwnProperty(key)) {
                deletedObjs[key] = null;
            }
        }
        let cardsRoot = firebase.database().ref("cards" );
        console.log(deletedObjs);
        cardsRoot.update(deletedObjs);
        categoryRef.remove();
        initCategory();
    }
}

function saveCategory() {
    const title = document.getElementById("category-title").value;
    let parent = document.getElementById("category-parent").value;
    if(parent !== '') {
        parent = null;
    }
    if(title) {
        if(categoryRef == null) {
            categoryRef = firebase.database().ref('categories').push();
        }
        categoryRef.set({
            title: title,
            parent: parent
        });
        console.log(categoryRef.key);
        categoryRef = firebase.database().ref('categories/' + categoryRef.key);
    } else {
        window.alert("Bitte gib einen Titel für die Kategorie an.");
    }
}


const saveCardButton = document.getElementById("card-controls-save");
saveCardButton.addEventListener("click", saveCard);

const newCardButton = document.getElementById("card-controls-new");
newCardButton.addEventListener("click", initCard);

const deleteCardButton = document.getElementById("card-controls-delete");
deleteCardButton.addEventListener("click", deleteCard);

const saveCategoryButton = document.getElementById("category-controls-save");
saveCategoryButton.addEventListener("click", saveCategory);

const deleteCategoryButton = document.getElementById("category-controls-delete");
deleteCategoryButton.addEventListener("click", deleteCategory);

// TODO: ADD HIERARCHICAL CATEGORY FUNCTION