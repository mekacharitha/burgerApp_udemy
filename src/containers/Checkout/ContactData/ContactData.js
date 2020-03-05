import React , {Component} from 'react' ;
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '.././../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state={
        orderForm:{
            name: {
               elementType:'input',
               elementConfig:{
                   type:'text',
                   placeholder:'Your name'
               }, 
               value:'',
               validation :{
                   required:true
               },
               valid:false,
               touched:false
            },
            street: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your street'
                }, 
                value:'',
                validation :{
                    required:true
                },
                valid:false,
                touched:false
             },
            pincode: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your pincode'
                }, 
                value:'',
                validation :{
                    required:true,
                    minLen:5,
                    maxLen:5
                },
                valid:false,
                touched:false,
             },
            country: {
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your country'
                }, 
                value:'',
                validation :{
                    required:true
                },
                valid:false,
                touched:false,
             },
            email: {
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your email'
                }, 
                value:'',
                validation :{
                    required:true
                },
                valid:false,
                touched:false,
             },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[
                        {
                            value:'fastest' , displayValue:'Fastest'
                        },
                        {
                            value:'cheapest' , displayValue:'Cheapest'
                        }
                ]
                }, 
                value:'fastest',
                validation :{} ,
                 valid:true,
                 touched:false,
             },
        },
        formIsValid :false,
        loading:false,
       
    }

    orderHandler = (event) =>{
        event.preventDefault();

        this.setState({loading:true});
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] =this.state.orderForm[formElementIdentifier].value ;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData:formData,
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading:false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading:false })
            })
    }

    inputChangeHandler = (event , inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true
        updatedFormElement.valid = this.ckeckValidity(updatedFormElement.value , updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        console.log(formIsValid);
        this.setState({
            orderForm:updatedOrderForm,
            formIsValid:formIsValid,
        })
    }

    ckeckValidity = (value , rules) =>{
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
        return isValid;
    }

    render(){
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            })
        }
        let form =(
                <form onSubmit ={this.orderHandler}>
                     {formElementsArray.map(formelement =>(
                         <Input 
                                changed={(event) => this.inputChangeHandler(event , formelement.id)}
                                key = {formelement.id}
                                touched ={formelement.config.touched}
                                shouldValidate ={formelement.config.validation}
                                invalid={!formelement.config.valid}
                                elementType={formelement.config.elementType} 
                                elementConfig={formelement.config.elementConfig}
                                value={formelement.config.value}/>
                         ))}
                     <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
                 </form>
        );
        if(this.state.loading){
            form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                 <h4>Enter your contact data </h4>
                 {form}
            </div>
        )
    }
}

export default ContactData;