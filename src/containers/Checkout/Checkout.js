import React , {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import {Route , Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
//import * as actions from '../../store/actions/ActionsTypes';

class Checkout extends Component {
   
    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search)
    //     const ingredients = {};
    //     let price
    //     for(let param of query.entries()){
    //         //['salad','1']
    //         if(param[0] === 'price'){
    //             price = param[1]
    //         }
    //         else{
    //         ingredients[param[0]] = +param[1]
    //         }
    //     }
    //     this.setState({ingredients : ingredients, totalPrice:price})
    // }


    checkoutCancelHandler = () =>{
        this.props.history.goBack();
    }

    checkoutContinueHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

    render(){ 
        let summary = <Redirect to="/" />
        const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
        if(this.props.ings){
            summary = (
                <div>
                    {purchasedRedirect}
                <CheckoutSummary 
                ingredients={this.props.ings}
                CheckoutCancel ={this.checkoutCancelHandler}
                CheckoutContinue = {this.checkoutContinueHandler}/>
        
                <Route path={this.props.match.path + '/contact-data'} 
                component ={ContactData}/>
                </div>
            );
        }
        return summary ;
    }
}

const mapStateToProps = state =>{
    return{
        ings:state.burgerBuilder.ingredients,
        purchased:state.order.purchased,
    }
}



export default connect(mapStateToProps )(Checkout) ;
