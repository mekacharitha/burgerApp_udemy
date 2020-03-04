import React , {Component} from 'react';
import Order from '../../components/Order/order';
import axios from '../../axios-orders';
import withErrorHandler from '../../withErrorHandling/withErrorHandling';
class Orders extends Component {
    
    state = {
        orders:[],
        loading:true,
    }
    
    componentDidMount() {
        axios.get('/orders.json')
        .then(res =>{
            const fetchorders = [];
            for(let key in res.data){
                fetchorders.push({
                    ...res.data[key],
                    id:key
                })
            }
            this.setState({loading:true , orders:fetchorders})
        })
        .catch(err => {
            this.setState({loading:false})
        })
    }
    render(){
        return(
            <div>
                {this.state.orders.map( order =>(
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}/>
                ))}
            </div>

        );
    }
}

export default withErrorHandler(Orders, axios); 