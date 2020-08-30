import {SubscriptionClient} from "subscriptions-transport-ws";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import {applyMiddleware, compose, createStore} from "redux";
import reducers from "../reducers";

const subscriptionClient = new SubscriptionClient("ws://localhost:4000/", {
    reconnect: true
});

export const GraphQLClient = new ApolloClient({
    link: new WebSocketLink(subscriptionClient),
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose();
export const ReduxStore = createStore(
    reducers,
    composeEnhancers(applyMiddleware())
);
