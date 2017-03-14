import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';

export default class FormInput extends Component {
    render(){
        return(
            <div className="signup_input_wrapper">
                <input
                    type={this.props.type || 'test'}
                    name={this.props.name}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.props.onChange(e.target.name, e.target.value)}
                    className= {this.props.error ? "signup_input_error" : "signup_input"}
                />
                {this.props.error ? <div className="signup_error">{this.props.error}</div> : null }
            </div>
        );
    }

}

FormInput.PropTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password']),
    error: PropTypes.string,
    placeholder: PropTypes.string,
};
