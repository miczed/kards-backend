import React, {Component} from 'react';
import {render} from 'react-dom';


const Icons = {
    'cards' : 'assets/icons/cards.svg'
};


export default class Icon extends Component {
    renderIcon(name) {
        return (<img src={Icons[name]} />)
    }

    render() {
        return (
            this.renderIcon(this.props.name)
        );
    }

}
