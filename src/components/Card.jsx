import React, {Component} from 'react';
export default class Card extends Component {
    constructor() {
        super();
        this.state = {
            front: true,
        }
    }
    clickHandler = () => {
      this.setState({front: !this.state.front});
    };
    render() {
        return(
            <div className="card" onClick={this.clickHandler}>
                { this.state.front ? <div className="front">{this.props.text}</div> : <div className="front">Backside.</div>}
            </div>
        );
    }
}