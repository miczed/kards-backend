import { observable, action } from 'mobx';
import Validator from 'validatorjs';


class SignUpStore {

    // For ReCaptcha V2.0
    @observable isHuman = false;

    @observable form = {
        fields: {
            email: {
                value: '', // value of input field is saved here
                error: null, // error text is saved here if there is a validation error
                rule: 'required|email' // rules for validation
            },
            username: {
                value: '', //binds to value
                error: null,
                rule: 'required'
            },
            firstname: {
                value: '', //binds to value
                error: null,
                rule: 'required'
            },
            lastname: {
                value: '', //binds to value
                error: null,
                rule: 'required'
            },
            password: {
                value: '',
                error: null,
                rule: 'required'
            }
        },
        meta: {
            isValid: true,
            error: null,
        },
    };

    /**
     * UNTESTED
     * Takes Field and Value as parameters and saves the new value
     * to the corresponding field inside the form object above (the method is called as an onChange method
     * in the FormInput Elements inside the SignUpView
     * @param field
     * @param value
     */
    @action
    onFieldChange = (field, value) => {
        this.form.fields[field].value = value;
        let {email, username, firstname, lastname, password} = this.form.fields
        var validation = new Validator(
            {email: email.value, username: username.value, firstname: firstname.value, lastname: lastname.value, password: password.value},
            {email: email.rule, username: username.rule, firstname: firstname.rule, lastname: lastname.rule, password: password.rule},
        )
        this.form.meta.isValid = validation.passes();
        this.form.fields[field].error = validation.errors.first(field)
    };

    /**
     * UNTESTED
     * If the ReCaptcha is filled out correctly and the user is identified as a human,
     * this method is called as an onChange method and sets the isHuman boolean to true
     */
    @action
    onReCaptchaChange = () => {
        this.isHuman = true;
    };

}

export default new SignUpStore();