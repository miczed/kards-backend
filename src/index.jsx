import React, {Component} from 'react';
import {render} from 'react-dom';

import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import DashboardView from './views/DashboardView.jsx';
import LearnView from './views/LearnView.jsx';
import LoginView from './views/LoginView.jsx';
import SignUpView from './views/SignUpView.jsx';
import ProfileView from './views/ProfileView.jsx';

import {observer} from 'mobx-react';
import {reaction, useStrict } from 'mobx';
import UserStore from './stores/UserStore.jsx';
import SetView from "./views/SetView.jsx";
import EditView from "./views/EditView.jsx";

// Import scss file which will be automatically included in the bundle.js
require("./scss/style.scss");
import 'bootstrap/dist/css/bootstrap.css';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';

// sets mobx to strict mode
useStrict(true);


/**
 * Private Route that redirects to the login page, if user is not authed
 */
function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    )
}

/**
 * Public Route that redirects to the site the user initially wanted to look at or to the dashboard
 */

function PublicRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} />
                :  (props && props.location && props.location.from) ? <Redirect to={props.location.state.from.pathname} /> : <Redirect to='/dashboard' />
            }
        />
    )
}

/**
 * Main Component of the app
 * Handles routing and redirect / authentication
 */
@observer
export default class App extends Component {
    constructor(props) {
      super(props);
      // when the user of the app changes, call the startApp function
      reaction(() => UserStore.user, () => this.startApp(UserStore.user));
      this.state = {
          authed: false,
          loading: true,
      };
    }

  startApp(user) {
      if (user) {
          this.setState({
              authed: true,
              loading: false,
          })
      } else {
          this.setState({
              loading: false,
              authed: false,
          })
      }
  }

  render () {
      return this.state.loading === true ? <h1>Loading</h1> : (
          <Router>
              <Switch>
                  <PrivateRoute path='/' exact component={DashboardView} />
                  <PublicRoute authed={this.state.authed} path='/signup' component={SignUpView} />
                  <PublicRoute authed={this.state.authed} path='/login' component={LoginView} />
                  <PrivateRoute authed={this.state.authed} path='/dashboard' component={DashboardView} />
                  <PrivateRoute authed={this.state.authed} path='/sets/:key/edit' component={EditView} />
                  <PrivateRoute authed={this.state.authed} path='/sets/:key' component={SetView} />
                  <PrivateRoute authed={this.state.authed} path='/profile' component={ProfileView} />
                  <PrivateRoute authed={this.state.authed} path='/learn' component={LearnView} />
                  <Route render={() => <h3>No Match</h3>} />
              </Switch>
          </Router>
      )
  }

}
render((<App />), document.getElementById('app'));
