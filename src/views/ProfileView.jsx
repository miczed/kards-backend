import React, {Component} from 'react';
import {render} from 'react-dom';
import firebaseApp from '../helpers/firebase.jsx';

import NavigationView from './NavigationView.jsx';
import FooterView from '../components/Footer.jsx';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {errors: [], username: UserStore.username, firstname: UserStore.firstname, lastname: UserStore.lastname};
    }
    // if we use the arrow syntax here, we can omit .bind(this)
    handleSubmit = (event) => {
        event.preventDefault();
        let errors = [];
        const firstname = document.getElementById("profile_input_firstname").value;
        const lastname = document.getElementById("profile_input_lastname").value;
        const username = document.getElementById("profile_input_username").value;
        console.log(username);
        if(firstname === "") {
            errors["profile_input_firstname"] = true;
        }
        if(lastname === "") {
            errors["profile_input_lastname"] = true;
        }
        if(username === "") {
            errors["profile_input_username"] = true;
        }
        console.log(errors);
        if(Object.keys(errors).length == 0) {
            UserStore.updateUserInfo(username,firstname,lastname).then(() => {

            }).catch((error) => {
                alert(error.message);
            });
        }
        this.setState({ errors: errors});
    };
    handleChange = (event,stateValue) => {
        const changedState = [];
        changedState[stateValue] = event.target.value;
        this.setState(changedState);
    };
    render() {
        return (
            <div>
                <NavigationView />
                <div className="profile">
                    <p>Profile Component</p>
                    <p>Username: {UserStore.username}</p>
                    <form onSubmit={this.handleSubmit}>
                        <label>Username</label>
                        <input type="text" id="profile_input_username" value={this.state.username} onChange={this.handleChange}/>
                        { this.state.errors["profile_input_username"] ? <span className="error">Username cannot be empty.</span> : null}
                        <label>First Name</label>
                        <input type="text" id="profile_input_firstname" value={this.state.firstname} onChange={this.handleChange}/>
                        { this.state.errors["profile_input_firstname"] ? <span className="error">Firstname cannot be empty.</span> : null}
                        <label>Last Name</label>
                        <input type="text" id="profile_input_lastname" value={this.state.lastname} onChange={this.handleChange}/>
                        { this.state.errors["profile_input_lastname"] ? <span className="error">Lastname cannot be empty.</span> : null}
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <FooterView />
            </div>
        );
    }

}

