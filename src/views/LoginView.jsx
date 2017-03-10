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
    handleLogin = () => {
      // TODO:
      const email = document.getElementById("login_input_email").value;
      const password = document.getElementById("login_input_password").value;
      UserStore.login(email, password);

    };
    componentWillMount() {
        console.log(this.props.location.state.from);
    }
    render() {
        return (
                <div className="container">
                    <div className="login">
                        <h1>Knub.io</h1>
                        <h2>Lerne & teile dein Wissen.</h2>
                        <div className="card">
                            <input id="login_input_email" placeholder="Deine E-Mail Adresse" type="mail" />
                            <hr />
                            <input id="login_input_password" placeholder="Dein Passwort" type="password" />
                        </div>
                    <button className="btn btn-primary" onClick={this.handleLogin}>Login</button>
                    </div>
                </div>
        );
    }

}

