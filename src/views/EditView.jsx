import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import ReactQuill from "react-quill";

import Icon from '../components/Icon.jsx';

const Cards = [
    {title: 'Tomato', backgroundColor: 'red'},
    {text: 'Aubergine', backgroundColor: 'purple'},
    {text: 'Courgette', backgroundColor: 'green'},
    {text: 'Blueberry', backgroundColor: 'blue'},
    {text: 'Umm...', backgroundColor: 'cyan'},
    {text: 'orange', backgroundColor: 'orange'},
];





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
                <div className="cardEditor">
                    <input type="text" placeholder="Give your card a title.." className="transparentInput"/>
                    <div  className="card">
                        <ReactQuill value={this.state.front}
                            onChange={this.handleChange.bind(this)} />
                        <a><Icon name="switch_side"/> Rückseite</a>
                        <span>12/500</span>
                    </div>
                    <p>
                        Du hast Änderungen an diesem Eintrag vorgenommen, möchtest du die Änderungen nur bei dir speichern oder mit der Community teilen?
                    </p>
                    <a className="btn btn-primary">Teilen</a>
                    <a className="btn btn-regular">Nur für mich</a>
                </div>
            </div>
        );
    }

}
