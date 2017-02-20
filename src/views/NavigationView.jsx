import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';


@observer
class NavigationView extends Component {

    handleLogout(){
      UserStore.logout();
    }

    render() {
        return (
          <div className="nav_wrapper">
            <div className="nav">
              <p className="nav_logo">Kards</p>
              {/* <input placeholder="Hier kommt die Suchbar..." /> */}
              <div className="nav_user">
                <p className="userPic">[Pic]</p>
                <a className="signout" href="#" onClick={this.handleLogout}>Abmelden</a>
              </div>
            </div>
          </div>
        );
    }

}

module.exports = NavigationView;
