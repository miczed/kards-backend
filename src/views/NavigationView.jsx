import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';
import UserStore from '../stores/UserStore.jsx';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

@observer
export default class NavigationView extends Component {

    createCard(){
        alert("card");
    }

    createSet(){
        alert("set");
    }

    createLernstream(){
        alert("lernstream");
    }

    handleLogout(){
      UserStore.logout();
    }

    render() {
        return (
          <div className="nav_wrapper">
            <div className="nav container">
              <div className="nav_logo float-left"><p>Knub.io</p></div>
              {/* <input placeholder="Hier kommt die Suchbar..." /> */}
              <div className="nav_user float-right">
                  <div className="nav_profile float-right">
                      <img src={UserStore.avatarUrl} className="userPic float-left" />
                      <UncontrolledDropdown className="float-right">
                          <DropdownToggle caret>
                          </DropdownToggle>
                          <DropdownMenu right>
                              <DropdownItem header>Eingeloggt als <br/> {UserStore.fullName} </DropdownItem>
                              <DropdownItem onClick={ () => { this.handleLogout() } }>Abmelden</DropdownItem>
                              <DropdownItem>Profil</DropdownItem>
                              <DropdownItem>Einstellungen</DropdownItem>
                          </DropdownMenu>
                      </UncontrolledDropdown>
                  </div>
                  <div className="nav_add float-right">
                      <UncontrolledDropdown className="float-right">
                          <DropdownToggle caret>
                              Hinzufügen
                          </DropdownToggle>
                          <DropdownMenu right>
                              <DropdownItem onClick={ () => { this.createCard() } }>Neue Karte</DropdownItem>
                              <DropdownItem onClick={ () => { this.createSet() } }>Neues Set</DropdownItem>
                              <DropdownItem onClick={ () => { this.createLernstream() } }>Neuer Lernstream</DropdownItem>
                          </DropdownMenu>
                      </UncontrolledDropdown>
                  </div>
              </div>
            </div>
          </div>
        );
    }

}

