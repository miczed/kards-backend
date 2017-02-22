import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';
import ProfileView from './ProfileView.jsx';
import NavigationView from './NavigationView.jsx';
import FooterView from '../components/FooterView.jsx';

@observer
export default class DashboardView extends Component {

    render() {
        return (
            <div>
                <NavigationView />
                <ProfileView />
                <FooterView />
                {this.props.children}
            </div>
        );
    }

}
