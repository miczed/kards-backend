import React, {Component} from 'react';
import {render} from 'react-dom';
import firebaseApp from '../helpers/firebase.jsx';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
export default class LoginView extends Component {

    handleLogin() {
      // TODO:
      var email = document.getElementById("login_input_email").value;
      var password = document.getElementById("login_input_password").value;
      UserStore.login(email, password);
    }

    render() {
        return (
          <div className="login_wrapper">
            <div className="login">

              <h1>Kards</h1>

              <p>E-Mail Adresse</p>
              <input id="login_input_email" placeholder="Benutzername" type="mail" />

              <p>Passwort</p>
              <input id="login_input_password" placeholder="Passwort" type="password" />

              <button onClick={this.handleLogin}>Login</button>

              <p className="login_signup">Neu bei Kards? <a href="#">Erstelle einen Account</a></p>

            </div>
          </div>
        );
    }

}

