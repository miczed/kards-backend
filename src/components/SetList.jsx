import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import Icon from '../components/Icon.jsx';
@observer
export default class SetList extends React.Component {
    removeSet(set) {
        set.store.remove(set.key);
    }
    renderSet(key,set) {
        return (
            <li className="card set" key={key}>
                <h3>{set.title}</h3> <a href="#" onClick={ () => { this.removeSet(set) } }>Delete</a>
                <div className="meta">
                    <Icon name="cards"/><span>{set.cards.size}</span>
                    <Icon name="collaborators"/><span>{set.collaborators.size}</span>
                    <Icon name="views"/><span>{set.views}</span>
                </div>
            </li> );
    }
    render() {
        return (
            <ul>
                { this.props.sets.entries().map((set) => this.renderSet(set[0],set[1]))}
            </ul>
        );
    }

}

