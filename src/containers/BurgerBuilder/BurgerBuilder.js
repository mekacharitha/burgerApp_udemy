import React , { Component } from "react";

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICE ={
    salad:10,
    cheese:15,
    meat:25,
    bacon:20,
}

class BurgerBuilder extends Component{
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }
    state ={
        ingredients:{
            salad:0,
            bacon:0,
            cheese:0,
            meat:0,
        },
        totalPrice:50,
        purchasable:false,
        purchasing:false,
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum , el)=>{
                return sum+el;
            } , 0);
        this.setState({purchasable : sum>0});
    }

    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount+1;
        const updatedIngredients = {
           ...this.state.ingredients 
        }
        updatedIngredients[type]=updateCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+priceAddition;
        this.setState({
            totalPrice : newPrice,
            ingredients:updatedIngredients,
        })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        if(oldCount <=0){
            return;
        }
        const updateCount = oldCount-1;
        const updatedIngredients = {
           ...this.state.ingredients 
        }
        updatedIngredients[type]=updateCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice-priceDeduction;
        this.setState({
            totalPrice : newPrice,
            ingredients:updatedIngredients,
        })
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = ()=> {
        this.setState({
            purchasing:true,
        })
    }

    purchaseCancelHandler = ()=> {
        this.setState({
            purchasing:false,
        })
    }

    purchaseContinueHandler = ()=> {
        alert("You Continue")
    }
    
    render () {
         const disableinfo ={
            ...this.state.ingredients 
        };
        for(let key in disableinfo){
            disableinfo[key] = disableinfo[key] <= 0 ;
        }
        return (
           <Aux>
               <Modal show={this.state.purchasing}
                      modalClosed ={this.purchaseCancelHandler}>
                   <OrderSummary ingredients={this.state.ingredients}
                                 price ={this.state.totalPrice.toFixed(2)}
                                 purchaseCancel={this.purchaseCancelHandler}
                                 purchaseContinue={this.purchaseContinueHandler} />
               </Modal>
               <Burger ingredients={this.state.ingredients}/>             
               <BuildControls 
                    ingredientsAdded ={this.addIngredientHandler}
                    ingredientsRemoved={this.removeIngredientHandler} 
                    disabled = {disableinfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    order={this.purchaseHandler}
               /> 
           </Aux>
        );
    }
}

export default BurgerBuilder ;