import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';


@observer
export default class NavigationView extends Component {

    handleLogout(){
      UserStore.logout();
    }

    render() {
        return (
          <div className="nav_wrapper">
            <div className="nav container">
              <p className="nav_logo">Knub.io</p>
              {/* <input placeholder="Hier kommt die Suchbar..." /> */}
              <div className="nav_user">
                <p className="userPic">[Pic]</p>
                <a className="signout btn btn-regular" href="#" onClick={this.handleLogout}>Abmelden</a>
              </div>
            </div>
          </div>
        );
    }

}

