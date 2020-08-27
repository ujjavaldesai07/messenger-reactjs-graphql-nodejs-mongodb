import pkg from "graphql-yoga"
const {GraphQLServer} = pkg;

import _ from "lodash"
import express from "express"
import mongoose from "mongoose"
import {typeDefs} from "./typeDefs.js"
import {resolvers, pubsub} from "./resolvers.js"

mongoose.connect("mongodb://localhost:27017/UserApp",
     {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, autoIndex: false});

const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});

mongoose.connection.once("open", function(){
    server.start(({port}) => console.log(`Server is running on http://localhost:${port}`))
});