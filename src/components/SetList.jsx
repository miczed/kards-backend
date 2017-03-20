import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';

@observer
export default class SetList extends React.Component {
    removeSet(set) {
        set.store.remove(set.key);
    }
    renderSet(key,set) {
        return ( <li className="card" key={key}>{set.title} <a href="#" onClick={ () => { this.removeSet(set) } }>Delete</a></li> );
    }
    render() {
        return (
            <ul>
                { this.props.sets.entries().map((set) => this.renderSet(set[0],set[1]))}
            </ul>
        );
    }

}

