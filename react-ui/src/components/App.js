import React from 'react';
import '../App.css';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import SideBar from "./Sidebar";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {WebSocketLink} from "@apollo/client/link/ws";
import log from "loglevel";

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

function App() {
    log.info(`[App] Rendering App Component....`)
    return (
        <ApolloProvider client={client}>
            <SideBar/>
        </ApolloProvider>
    );
}

export default App;
