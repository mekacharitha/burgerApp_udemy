import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import Spinner from '../UI/Spinner/Spinner';
import {Redirect} from 'react-router-dom';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    required: true,
                    minLen:6,
                },
                valid: false,
                touched: false
            },
        },
        isSignUp :true,
    }

    componentDidMount(){
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath()
        }
    }

    inputChangeHandler = (event , controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]:{
                ...this.state.controls[controlName],
                value:event.target.value,
                valid:this.checkValidity(event.target.value , this.state.controls[controlName].validation),
                touched:true,
            }
        };
        this.setState({controls:updatedControls})
    }

    checkValidity = (value , rules) =>{
        let isValid = true;
        if(!rules){
            return true;
        }
        if(rules.required){
            isValid =value.trim() !== "" && isValid;
        }
        if(rules.minLen){
            isValid = value.length >= rules.minLen && isValid;
        }
        if(rules.maxLen){
            isValid = value.length <= rules.maxLen && isValid;
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value ,this.state.controls.password.value , this.state.isSignUp)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp : !prevState.isSignUp };
        })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls){
            formElementsArray.push({
                id:key,
                config:this.state.controls[key]
            })
        }
        let form = formElementsArray.map(formelement => (
            <Input 
            changed={(event) => this.inputChangeHandler(event , formelement.id)}
            key = {formelement.id}
            touched ={formelement.config.touched}
            shouldValidate ={formelement.config.validation}
            invalid={!formelement.config.valid}
            elementType={formelement.config.elementType} 
            elementConfig={formelement.config.elementConfig}
            value={formelement.config.value} />
            // <Input />
            
        ));

        if(this.props.loading){
            form = <Spinner/>
        }
        let errorMsg = null;
        if(this.props.error){
            errorMsg = (
                <p>{this.props.error.message}</p>
            )
        }
        let authRedirect = null;
        if(this.props.isAauthenticated){
            authRedirect=<Redirect to ={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMsg}
                <form onSubmit={this.submitHandler}>
                    {form}
                <Button  btnType="Success">SUBMIT</Button>
                <br />
                <Button clicked={this.switchAuthModeHandler} btnType="Danger">
                    SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        loading :state.auth.loading,
        error:state.auth.error,
        isAauthenticated:state.auth.token !== null,
        buildingBurger:state.burgerBuilder.building,
        authRedirectPath:state.auth.authRedirectPath,
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onAuth: (email , password , isSignUp)  => dispatch(actions.auth(email ,password , isSignUp)),
        onSetRedirectPath : () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps ,mapDispatchToProps)(Auth);