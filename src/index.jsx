import React, {Component} from 'react';
import {render} from 'react-dom';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import LoginView from './views/LoginView.jsx';
import DashboardView from './views/DashboardView.jsx';


import {observer} from 'mobx-react';
import {reaction} from 'mobx';
import UserStore from './stores/UserStore.jsx';

// Import scss file which will be automatically included in the bundle.js
require("./scss/style.scss");

@observer
class App extends Component {
  constructor() {
      super();
      // when the user of the app changes, call the startApp function
      reaction(() => UserStore.user, () => this.startApp(UserStore.user));
  }
  startApp(user) {
      // if user isn't set then load login form
      if(!user) {
          this.props.router.push('/login')
      } else {
          this.props.router.push('/dashboard')
      }
  }
  render () {
      return (
          <div>
              {this.props.children}
          </div>
      )
  }

}

function requireAuth(nextState, replace) {
    if (!UserStore.user) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

render((
    <Router history={browserHistory}>
        <Route path="/" component={App} >
            <IndexRoute component={DashboardView} onEnter={requireAuth} />
            <Route path="/login" component={LoginView} />
            <Route path="/dashboard" component={DashboardView} onEnter={requireAuth}/>
        </Route>
    </Router>
), document.getElementById('app'));