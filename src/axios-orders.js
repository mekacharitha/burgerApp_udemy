import axios from 'axios' ;
const instance = axios.create({
    baseURL:'https://burgerapp-eb0b0.firebaseio.com/'
})

export default instance;