// store the redux store
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from "redux-thunk";
import reducer from '../reducers/index'

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    storeEnhancers(applyMiddleware(thunk)) 
    // use redux-thunk, can add custom middleware inside applyMiddleware(takes multiple middlewares as arguments)
    // when dispatch action, it will run through all middlewares
);

export default store;