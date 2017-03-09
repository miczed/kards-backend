import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import NavigationView from './NavigationView.jsx';
import CardStack from '../components/CardStack.jsx';


@observer
export default class LearnView extends Component {

    render() {
        return (
            <div>
                <NavigationView />
                <CardStack />
                {this.props.children}
            </div>
        );
    }

}
