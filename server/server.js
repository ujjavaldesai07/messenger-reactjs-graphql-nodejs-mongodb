import pkg from "graphql-yoga"

const {GraphQLServer} = pkg;
import mongoose from "mongoose"
import {typeDefs} from "./graphqlResolvers/typeDefs.js"
import {resolvers} from "./graphqlResolvers/resolvers.js"
import {pubsub} from "./constants.js";
import {mongodbCleaner} from "./mongodbCleaner.js";

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/Messenger"

mongoose.connect(MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, autoIndex: false});

if(process.env.MONGODB_URI) {
    mongoose.connection.on('connected', mongodbCleaner);
}

const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});

mongoose.connection.once("open", function () {
    server.start(({port}) => console.log(`Server is running on port = ${port}`))
});