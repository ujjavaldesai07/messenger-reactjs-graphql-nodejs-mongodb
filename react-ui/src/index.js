import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Provider} from "react-redux";
import log from "loglevel";
import {ApolloProvider} from "@apollo/client";
import {GraphQLClient, ReduxStore} from "./constants/config";

// log.disableAll(true)
log.setLevel("info")

ReactDOM.render(
    <Provider store={ReduxStore}>
        <ApolloProvider client={GraphQLClient}>
            <App/>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);