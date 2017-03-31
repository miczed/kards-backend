import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import { UserStore, CardStore } from '../stores/index.jsx';

const Cards = [
    {title: 'Tomato', backgroundColor: 'red'},
    {text: 'Aubergine', backgroundColor: 'purple'},
    {text: 'Courgette', backgroundColor: 'green'},
    {text: 'Blueberry', backgroundColor: 'blue'},
    {text: 'Umm...', backgroundColor: 'cyan'},
    {text: 'orange', backgroundColor: 'orange'},
]



@observer
export default class SetView extends Component {
    constructor(props) {
        super(props);
        this.cardStore = new CardStore(this.props.match.params.key,UserStore);
    }
    render() {
        return (
            <div>
                <NavigationView />
                <p>Uelimueli { this.props.match.params.key }</p>
            </div>
        );
    }

}
