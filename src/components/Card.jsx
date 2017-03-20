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
            <div className={"card " + (this.state.front ? "showFront" : "showBack")} onClick={this.clickHandler}>
                { this.state.front ? <div className="front face">{this.props.text}</div> : <div className="back face">Backside.</div> }
            </div>
        );
    }
}
