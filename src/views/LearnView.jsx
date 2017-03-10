import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import SwipeCards from '../components/SwipeCards.jsx';
import Card from '../components/Card.jsx';
import AnimTest from '../components/AnimTest.jsx';

const Cards = [
    {text: 'Tomato', backgroundColor: 'red'},
    {text: 'Aubergine', backgroundColor: 'purple'},
    {text: 'Courgette', backgroundColor: 'green'},
    {text: 'Blueberry', backgroundColor: 'blue'},
    {text: 'Umm...', backgroundColor: 'cyan'},
    {text: 'orange', backgroundColor: 'orange'},
]

@observer
export default class LearnView extends Component {
    constructor() {
        super();
        this.state = {
            cards: Cards
        }
    }
    handleYup (card) {
        console.log(`Yup for ${card.text}`)
    }
    handleNope (card) {
        console.log(`Nope for ${card.text}`)
    }
    render() {
        return (
            <div>
                <NavigationView />
                <SwipeCards
                    cards = {this.state.cards}
                    renderCard = {(cardData) => <Card {...cardData} />}
                    renderNoMoreCards={() => <div>No more cards</div>}
                    handleYup={this.handleYup}
                    handleNope={this.handleNope}
                    stack={true}
                    stackOffsetY={-10}
                    yupText={"Gewusst"}
                    nopeText={"Nicht Gewusst"}
                />
            </div>
        );
    }

}
