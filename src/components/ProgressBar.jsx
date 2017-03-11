import React, {Component} from 'react';

export default class ProgressBar extends Component {
    constructor() {
        super();
    }
    render() {
        let width = Math.floor((this.props.progress / this.props.total) * 100 ) + "%";
        return(
            <div className="progressBar" style={{ width }}></div>
        );
    }
}