import React, { Component } from "react";

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHAndler from '../../withErrorHandling/withErrorHandling'
import {connect} from 'react-redux' ;
import * as burgerBuilderActions from '../../store/actions/index';


class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,
    }
    
    componentDidMount(){
        console.log(this.props);
        this.props.onInitIngredient();
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0 ;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     const updateCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     }
    //     updatedIngredients[type] = updateCount;
    //     const priceAddition = INGREDIENT_PRICE[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients,
    //     })
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updateCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     }
    //     updatedIngredients[type] = updateCount;
    //     const priceDeduction = INGREDIENT_PRICE[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients,
    //     })
    //     this.updatePurchaseState(updatedIngredients);
    // }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({
                purchasing: true,
            })
        }else{
            this.props.onSetRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false,
        })
    }

    purchaseContinueHandler = () => {
        // alert("You Continue")

        // this.setState({loading:true})
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Charitha',
        //         address: {
        //             street: 'BHEL Lig',
        //             pincode: '502032',
        //             country: 'India'
        //         },
        //         email: 'cherry@gmail.com',
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({loading:false , purchasing:false})
        //     })
        //     .catch(error => {
        //         this.setState({loading:false , purchasing:false})
        //     })
        
        // const queryParams = []
        // for(let i in this.props.ings){
        //     queryParams.push(encodeURIComponent(i) + '=' +encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price='+this.state.totalPrice)
        // const queryString = queryParams.join('&');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');

    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if ( this.props.ings ) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientsAdded={this.props.onIngredientsAdded}
                        ingredientsRemoved={this.props.onIngredientsRemoved}
                        disabled={disabledInfo}
                        isAuth={this.props.isAuthenticated}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        order={this.purchaseHandler}
                        price={this.props.price} />
                </Aux>
            );
            orderSummary = <OrderSummary
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancel={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler} />
        }
        // if (this.state.loading) {
        //     orderSummary = <Spinner />;
        // }
      
        return (
            <Aux>
                <Modal show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state =>{
    return{
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        error:state.burgerBuilder.error,
        isAuthenticated:state.auth.token !== null,
    };
}

const mapDispatchToProps = dispatch =>{
    return{
        onIngredientsAdded : (igName) =>
            dispatch (burgerBuilderActions.addIngredient(igName) ),
        onIngredientsRemoved : (igName) =>
            dispatch (burgerBuilderActions.removeIngredient(igName)),
        onInitIngredient :() => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase : () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetRedirectPath : () => dispatch(burgerBuilderActions.setAuthRedirectPath)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHAndler(BurgerBuilder , axios));