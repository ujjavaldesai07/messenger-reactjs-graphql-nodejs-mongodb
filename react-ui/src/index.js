import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Provider} from "react-redux";
import log from "loglevel";
import {createStore, applyMiddleware, compose} from "redux";
import reducers from './reducers'
import thunk from "redux-thunk";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {WebSocketLink} from "@apollo/client/link/ws";

// log.disableAll(true)
log.setLevel("info")

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose();
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
);

const GRAPHQL_ENDPOINT = "ws://localhost:4000/";

const subscriptionClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true
});

const webSocketLink = new WebSocketLink(subscriptionClient);


const client = new ApolloClient({
    link: webSocketLink,
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);