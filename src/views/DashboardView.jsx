import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import {reaction } from 'mobx';
import { SetStore, UserStore } from '../stores/index.jsx';
import ProfileView from './ProfileView.jsx';
import NavigationView from './NavigationView.jsx';
import FooterView from '../components/Footer.jsx';
import SetList from '../components/SetList.jsx';

@observer
export default class DashboardView extends Component {
    constructor() {
        super();
        this.setStore = new SetStore(UserStore);
    }
    newSet() {
        let title = prompt("Please enter the title of your Set", "");
        if (title != null) {
            this.setStore.create(title);
        }
    }
    render() {
        return (
            <div>
                <NavigationView />
                <div className="container">
                    <div className="subheader">
                        <h2>Deine Sets: ({this.setStore.sets.size})</h2>
                        <a className="btn btn-regular" href="#" onClick={this.newSet.bind(this)}>Neues Set</a>
                    </div>
                    <SetList sets={this.setStore.sets} />
                </div>
                <ProfileView />
                <FooterView />
                {this.props.children}
            </div>
        );
    }

}
