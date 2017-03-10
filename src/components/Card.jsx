import React, {Component} from 'react';
export default class Card extends Component {
    render() {
        return(
            <div className="card"><p>{this.props.text}</p></div>
        );
    }
}