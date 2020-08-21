import React from 'react';
import '../App.css';
import {ChatWindow} from "./ChatWindow";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import SideBar from "./Sidebar";

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <SideBar/>
        </ApolloProvider>
    );
}

export default App;
