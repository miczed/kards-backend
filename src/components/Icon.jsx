import React, {Component} from 'react';
import {render} from 'react-dom';

// Map names to SVG paths
const Icons = {
    'cards'         : 'assets/icons/cards.svg',
    'collaborators' : 'assets/icons/collaborators.svg',
    'views'         : 'assets/icons/views.svg'

};


export default class Icon extends Component {
    renderIcon(name) {
        if(Icons[name]) {
            return (<img className="icon" src={Icons[name]} />)
        } else {
            return (null);
        }

    }

    render() {
        return (
            this.renderIcon(this.props.name)
        );
    }

}
