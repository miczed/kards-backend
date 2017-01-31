/**
 * Created by michaelziorjen on 29.11.16.
 */
// Global cards store
let cardsStore = [];
let categoriesStore = [];
let currentSide = "front";
let cardsRef = firebase.database().ref("cards").orderByChild("category").equalTo("-KXjMk1x75diH2ZbqkJj");

cardsRef.once('value').then(function(snapshot){
    let data = snapshot.val();
    cardsStore = snapshot.val(); // Store returned data in global cards store
    let dataWithKeys = Object.keys(data).map((key) => {
        let obj = data[key];
        obj._key = key;
        return obj;
    });
    loadCards(dataWithKeys);
});


function loadCards(dataWithKeys) {
    currentSide = "front";
    const elem = document.getElementById("content");
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.firstChild);
    }
    for (let i = 0; i < dataWithKeys.length; i++) {
        let card = document.createElement("DIV");
        let front = document.createElement("DIV");
        let back = document.createElement("DIV");


        if(i == 0) {
            front.setAttribute("class", "card-front active" )
            card.setAttribute("class", "card active");
        } else {
            front.setAttribute("class", "card-front");
            card.setAttribute("class", "card");
        }

        back.setAttribute("class", "card-back");

        front.innerHTML = dataWithKeys[i].front_html;
        back.innerHTML = dataWithKeys[i].back_html;

        card.setAttribute("data-key", dataWithKeys[i]._key);

        card.appendChild(front);
        card.appendChild(back);
        elem.appendChild(card);

    }

    let meta = document.createElement("DIV");
    meta.setAttribute("id","meta");

    let counter = document.createElement("SPAN");
    counter.setAttribute("class","counter");
    counter.setAttribute("id","counter");
    counter.innerText = 1;

    let text = document.createTextNode(" von " + dataWithKeys.length + " in Software Engineering.");
    meta.appendChild(counter);
    meta.appendChild(text);

    elem.appendChild(meta);

}

function toggleCurrentSide() {
    if(currentSide == "front") {
        document.querySelector("#content .card.active .active").setAttribute("class","card-front");
        document.querySelector("#content .card.active .card-back").setAttribute("class","card-back active");
        currentSide = "back";
    } else {
        document.querySelector("#content .card.active .active").setAttribute("class","card-back");
        document.querySelector("#content .card.active .card-front").setAttribute("class","card-front active");
        currentSide = "front";
    }

}

const contentContainer = document.getElementById("content");
contentContainer.addEventListener("click", function() {
    toggleCurrentSide();

});

