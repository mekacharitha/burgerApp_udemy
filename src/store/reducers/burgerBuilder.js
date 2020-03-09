import * as actionTypes from '../actions/ActionsTypes';

const initialState = {
    ingredients:null,
    totalPrice:50,
    error:false,
   // building:false,
};

const INGREDIENT_PRICE = {
    salad: 10,
    cheese: 15,
    meat: 25,
    bacon: 20,
}

const reducers = (state = initialState , action ) =>{
    switch(action.type){
        case actionTypes.ADD_INGREDIENT :
            return{
                ...state,
                ingredients:{
                    ...state.ingredients,
                    [action.ingredientName]:state.ingredients[action.ingredientName]+1,
                 },
                 totalPrice:state.totalPrice + INGREDIENT_PRICE[action.ingredientName],
               //  building:true,
            };
        case actionTypes.REMOVE_INGREDIENT :
            return{
                ...state,
                ingredients:{
                    ...state.ingredients,
                    [action.ingredientName]:state.ingredients[action.ingredientName]-1,
                    totalPrice:state.totalPrice - INGREDIENT_PRICE[action.ingredientName],
                   // building:true,
                }
            };
        case actionTypes.SET_INGREDIENTS:
            return{
                ...state,
                ingredients:{
                    salad:action.ingredients.salad,
                    bacon:action.ingredients.bacon,
                    cheese:action.ingredients.cheese,
                    meat:action.ingredients.meat,
                },
                totalPrice:50,
                error:false,
              //  building:false,
            }
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return{
                ...state,
                error:true
            }

        default :
            return state;
            
    }
     
};

export default reducers;
