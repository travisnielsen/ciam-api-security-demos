import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as Counter from './Counter';
import * as WeatherForecasts from './WeatherForecasts';
import * as Authentication from './Authentication';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

const initialState = window.initialReduxState;

const reducers = {

    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    authentication: Authentication.reducer
};

const middleware = [
    thunk,
    routerMiddleware(history)
];

// In development, use the browser's Redux dev tools extension if installed
const enhancers = [];
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
enhancers.push(window.devToolsExtension());
}

const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );

export default store;