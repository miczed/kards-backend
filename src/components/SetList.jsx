import React, {Component} from 'react';
import {render} from 'react-dom';

import {observer} from 'mobx-react';

import Icon from '../components/Icon.jsx';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

@observer
export default class SetList extends React.Component {
    removeSet(set) {
        set.store.remove(set.key);
    }
    renderSet(key,set) {
        return (
            <li className="card set" key={key}>

                <div className="header">
                    <h3 className="float-left">{set.title}</h3>
                    <UncontrolledDropdown className="float-right">
                        <DropdownToggle caret>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Manage Collaborators</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={ () => { this.removeSet(set) } }>Delete Set</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="meta">
                    <Icon name="cards"/><span>{set.cards.size}</span>
                    <Icon name="collaborators"/><span>{set.collaborators.size}</span>
                    <Icon name="views"/><span>{set.views}</span>
                </div>

            </li> );
    }
    render() {
        return (
            <ul>
                { this.props.sets.entries().map((set) => this.renderSet(set[0],set[1]))}
            </ul>
        );
    }

}

