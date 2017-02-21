import React, {Component} from 'react';
import {render} from 'react-dom';
import firebaseApp from '../helpers/firebase.jsx';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
export default class ProfileView extends Component {

    render() {
        return (
          <div className="profile">
            <p>Profile Component</p>
          </div>
        );
    }

}

