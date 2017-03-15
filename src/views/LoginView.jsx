import React, {Component} from 'react';
import {render} from 'react-dom';
import firebaseApp from '../helpers/firebase.jsx';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
export default class LoginView extends Component {

    constructor() {
      super();
    }

    handleLogin() {
      const email = document.getElementById("login_input_email").value;
      const password = document.getElementById("login_input_password").value;
      UserStore.login(email, password);
    }

    componentWillMount() {

    }

    render() {
        return (
                <div className="container">

                    <div className="login_header">
                        <h1>Knub.io</h1>
                        <h2>Lerne und teile dein Wissen.</h2>
                    </div>

                    <div className="login">
                        <div className="card">
                            <p>E-Mail Addresse</p>
                            <input id="login_input_email" placeholder="Deine E-Mail Adresse" type="mail" />
                            <p>Passwort</p>
                            <input id="login_input_password" placeholder="Dein Passwort" type="password" />
                            <button className="btn btn-primary" onClick={this.handleLogin}>Anmelden</button>
                        </div>
                        <div className="signup_link">
                            <p>Neu bei Knub? <a href="/signup">Erstelle einen Account.</a></p>
                        </div>
                    </div>
                </div>
        );
    }

}

