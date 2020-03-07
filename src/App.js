import React, { Component } from 'react';
import {Route,Switch,Redirect,withRouter} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout'
import Orders from './containers/Orders/Orders' 
import Auth from './components/Auth/Auth';
import Logout from './components/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';


class App extends Component {
  
  componentDidMount(){
    this.props.onTryAutoSignUp();
  }

  render() {
    let routes = (
      <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/auth" component={Auth} />
          <Redirect to="/" />
      </Switch>
    );

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Redirect to="/" />
        </Switch>
      )
    }

    return (
      <div>
        <Layout>
            {routes}
        </Layout>        
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return{
      isAuthenticated:state.auth.token !== null ,
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    onTryAutoSignUp : () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps , mapDispatchToProps)(App));
