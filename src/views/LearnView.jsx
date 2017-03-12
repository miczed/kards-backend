import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import SwipeCards from '../components/SwipeCards.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const Cards = [
    {title: 'Tomato', backgroundColor: 'red'},
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
            cards: Cards,
            progress: 0
        }
    }
    storeProgress() {
        this.setState({ progress: this.state.progress + 1});
    }
    handleYup (card) {
        console.log(`Yup for ${card.text}`);
        this.storeProgress();
    }
    handleNope (card) {
        console.log(`Nope for ${card.text}`);
        this.storeProgress();
    }

    render() {
        return (
            <div>
                <NavigationView />
                <SwipeCards
                    cards = {this.state.cards}
                    renderCard = {(cardData) => <Card {...cardData} />}
                    renderNoMoreCards={() => <div>No more cards</div>}
                    handleYup={this.handleYup.bind(this)}
                    handleNope={this.handleNope.bind(this)}
                    stack={true}
                    stackOffsetY={-10}
                    yupText={"Gewusst"}
                    nopeText={"Nicht Gewusst"}
                />
                <ProgressBar progress={this.state.progress} total={this.state.cards.length} combo={null} />
            </div>
        );
    }

}
