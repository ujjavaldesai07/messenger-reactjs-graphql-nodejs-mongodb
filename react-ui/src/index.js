import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Provider} from "react-redux";
import log from "loglevel";
import {createStore, applyMiddleware, compose} from "redux";
import reducers from './reducers'
import thunk from "redux-thunk";

// log.disableAll(true)
log.setLevel("info")

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose();
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
    <Provider store={store}>
            <App/>
    </Provider>,
    document.getElementById('root')
);