import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';

@observer
export default class CardStack extends React.Component {

    render() {
        return (
            <div className="footer">
                <p>Footer Component</p>
            </div>
        );
    }

}

