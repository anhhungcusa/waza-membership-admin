import { createStore, applyMiddleware, compose } from 'redux'
import { rootReducer } from '../reducers/root-reducer';
import thunk from 'redux-thunk';


export const configStore = (preloadedState) => {
    const middlware = [
        thunk
    ]

    const middlwareEnhancer = applyMiddleware(...middlware);
    
    const enhancer = [
        middlwareEnhancer
    ]

    const composEnhancer = compose(...enhancer);
    const store = createStore(rootReducer, composEnhancer);

    return store;
}