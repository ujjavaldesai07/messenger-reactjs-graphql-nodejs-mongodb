import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Provider} from "react-redux";
import log from "loglevel";
import {ApolloProvider} from "@apollo/client";
import {GraphQLClient, ReduxStore} from "./config";
import {SnackbarProvider} from "notistack";
import ErrorBoundary from "./ErrorBoundary";

log.disableAll(true)
// log.setLevel("info")

ReactDOM.render(
    <Provider store={ReduxStore}>
        <ApolloProvider client={GraphQLClient}>
            <SnackbarProvider maxSnack={3}
                              anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                              }}>
                <ErrorBoundary>
                    <App/>
                </ErrorBoundary>
            </SnackbarProvider>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);