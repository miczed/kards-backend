import React, {Component} from 'react';
import {render} from 'react-dom';
import firebaseApp from './helpers/firebase.jsx';

import LoginView from './views/LoginView.jsx';
import ProfileView from './views/ProfileView.jsx';
import NavigationView from './views/NavigationView.jsx';
import FooterView from './views/FooterView.jsx';

import {observer} from 'mobx-react';
import UserStore from './stores/UserStore.jsx';

// Import scss file which will be automatically included in the bundle.js
require("./scss/style.scss");

@observer
class App extends Component {

  render () {
    if(!UserStore.user.firebaseUser){
      // Will be replaced by the the landing page in the future...
      return(
        <div>
          <LoginView user={UserStore.user} />
        </div>
      )
    }
    else {
      // In discussion --> could be replaced by something like a notification center (github style)
      return (
        <div>
          <NavigationView user={UserStore.user} />
          <ProfileView user={UserStore.user} />
          <FooterView />
        </div>
      )
    }
  }

}

render(<App />, document.getElementById('app'));