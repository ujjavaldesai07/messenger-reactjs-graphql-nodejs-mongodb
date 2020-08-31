import {SubscriptionClient} from "subscriptions-transport-ws";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import {applyMiddleware, compose, createStore} from "redux";
import reducers from "./reducers";

const SERVER_URL = process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : 'http://localhost:4000/'

const SOCKET_SERVER_URL =
    SERVER_URL.startsWith("https") ?
        SERVER_URL.replace("https", "wss")
        : SERVER_URL.replace("http", "ws")

const subscriptionClient = new SubscriptionClient(SOCKET_SERVER_URL, {
        reconnect: true
    });

export const GraphQLClient = new ApolloClient({
    link: new WebSocketLink(subscriptionClient),
    uri: SERVER_URL,
    cache: new InMemoryCache()
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose();
export const ReduxStore = createStore(
    reducers,
    composeEnhancers(applyMiddleware())
);
