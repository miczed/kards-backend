import React, {Component} from 'react';
import {render} from 'react-dom';
//import firebaseApp from '../helpers/firebase';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
class FooterView extends React.Component {

    render() {
        return (
          <div className="footer">
            <p>Footer Component</p>
          </div>
        );
    }

}

export default FooterView;
