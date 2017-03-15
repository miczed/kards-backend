import React, {Component} from 'react';
import {render} from 'react-dom';
import FormInput from './../components/forms/FormInput.jsx';

import ReCAPTCHA from 'react-google-recaptcha';

import {observer} from 'mobx-react';
import UserStore from './../stores/UserStore.jsx';
import SignUpStore from './../stores/SignUpStore.jsx';

@observer
export default class SignUpView extends Component {

    constructor() {
        super();
    }

    checkUsername(){
        // TODO: Check Username
    }

    handleSignUp() {
        /*const email = document.getElementById("signup_input_email").value;
        const username = document.getElementById("signup_input_username").value;
        const firstname = document.getElementById("signup_input_firstname").value;
        const lastname = document.getElementById("signup_input_lastname").value;
        const password = document.getElementById("signup_input_password").value;
        UserStore.createNewUser(email, password, username, firstname, lastname);*/
        alert("clicked");
    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="container">

                <div className="signup_header">
                    <h1>Knub.io</h1>
                    <h2>Lerne und teile dein Wissen.</h2>
                </div>

                <div className="signup">
                    <h2>Melde dich noch heute an.</h2>
                    <h1>Eine Anmeldung bei Knub ist schnell und kostenlos.</h1>
                    <div className="card">

                        <p>E-Mail Addresse</p>
                        <FormInput
                            type="email"
                            name="email"
                            value={SignUpStore.form.fields.email.value}
                            error={SignUpStore.form.fields.email.error}
                            onChange={SignUpStore.onFieldChange}
                            placeholder="Deine E-Mail Adresse"
                        />

                        <p>Benutzername</p>
                        <FormInput
                            type="text"
                            name="username"
                            value={SignUpStore.form.fields.username.value}
                            error={SignUpStore.form.fields.username.error}
                            onChange={SignUpStore.onFieldChange}
                            placeholder="Dein Benutzername"
                        />

                        <p>Vorname</p>
                        <FormInput
                            type="text"
                            name="firstname"
                            value={SignUpStore.form.fields.firstname.value}
                            error={SignUpStore.form.fields.firstname.error}
                            onChange={SignUpStore.onFieldChange}
                            placeholder="Dein Vorname"
                        />

                        <p>Nachname</p>
                        <FormInput
                            type="text"
                            name="lastname"
                            value={SignUpStore.form.fields.lastname.value}
                            error={SignUpStore.form.fields.lastname.error}
                            onChange={SignUpStore.onFieldChange}
                            placeholder="Dein Nachname"
                        />

                        <p>Passwort</p>
                        <FormInput
                            type="password"
                            name="password"
                            value={SignUpStore.form.fields.password.value}
                            error={SignUpStore.form.fields.password.error}
                            onChange={SignUpStore.onFieldChange}
                            placeholder="Dein Passwort"
                        />

                        <ReCAPTCHA
                            ref="recaptcha"
                            className="signup_recaptcha"
                            sitekey="6Lc2ABkUAAAAAHXlEJpHrIPSAFMfkh9z_TbEAMlc"
                            onChange={SignUpStore.onReCaptchaChange}
                        />

                        <button disabled={!SignUpStore.form.meta.isValid} className="btn btn-primary" onClick={this.handleSignUp}>Kostenlos Registrieren</button>

                        {/* TODO, doesn't work how it should SignUpStore.form.meta.error && <div> {SignUpStore.form.meta.error} </div> */}

                    </div>
                    <div className="login_link">
                        <p>Bereits bei Knub? <a href="/login">Einloggen.</a></p>
                    </div>
                </div>
            </div>
        );
    }

}

