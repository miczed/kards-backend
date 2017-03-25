import React, {Component} from 'react';
import {render} from 'react-dom';
//import firebaseApp from '../helpers/firebase';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';

@observer
export default class FooterView extends React.Component {

    render() {
        return (
          <div className="footer_wrapper">
            <div className="footer container">
                <p className="footer_copyright">© {new Date().getFullYear()} Knub. </p>
                <p className="footer_logo">Knub Logo</p>
                <p className="footer_links">Other useful links...</p>
              </div>
          </div>
        );
    }

}

