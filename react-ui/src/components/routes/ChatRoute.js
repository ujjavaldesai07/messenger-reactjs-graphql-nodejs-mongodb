import React from 'react';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {SideBar} from "../sections/Sidebar";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {WebSocketLink} from "@apollo/client/link/ws";
import log from "loglevel";
import {ChatWindow} from "../sections/ChatWindow";

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

function ChatRoute() {
    log.info(`[ChatRoute] Rendering ChatRoute Component....`)

    return (
        <ApolloProvider client={client}>
            <SideBar/>
            <ChatWindow/>
        </ApolloProvider>
    );
}

export default ChatRoute;
