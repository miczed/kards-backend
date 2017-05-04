import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import SwipeCards from '../components/SwipeCards.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ReactQuill from "react-quill";

const Cards = [
    {title: 'Tomato', backgroundColor: 'red'},
    {text: 'Aubergine', backgroundColor: 'purple'},
    {text: 'Courgette', backgroundColor: 'green'},
    {text: 'Blueberry', backgroundColor: 'blue'},
    {text: 'Umm...', backgroundColor: 'cyan'},
    {text: 'orange', backgroundColor: 'orange'},
]



@observer
export default class EditView extends Component {
    constructor() {
        super();
        this.state = {
            front: ''
        }
    }

    handleChange(value) {
        this.setState({ front: value })
    }

    render() {
        return (
            <div>
                <NavigationView />
                <ReactQuill value={this.state.front}
                            onChange={this.handleChange.bind(this)} />
            </div>
        );
    }

}
