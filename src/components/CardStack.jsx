import React, {Component} from 'react';
import {render} from 'react-dom';

const SWIPE_THRESHOLD = 120;


export default class CardStack extends React.Component {
    constructor(props) {
        super(props);
        //Use a persistent variable to track currentIndex instead of a local one.
    }
    render() {
        return (
            <div className="footer">
                <p>Footer Component</p>
            </div>
        );
    }

}

