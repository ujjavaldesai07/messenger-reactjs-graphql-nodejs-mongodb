import pkg from "graphql-yoga"

const {GraphQLServer} = pkg;
import {typeDefs} from "./graphqlResolvers/typeDefs.js"
import {resolvers} from "./graphqlResolvers/resolvers.js"
import {pubsub} from "./constants.js";
import mongoDB from 'mongodb';
import {mongodbCleaner} from "./mongodbCleaner.js";

const MongoClient = mongoDB.MongoClient;

const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/Messenger"

const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});
export let db

MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true},
    function (err, database) {
        if (err) throw err;

        db = database.db('Messenger');

        if (db && process.env.MONGODB_URI) {
            mongodbCleaner().catch(e => console.log(`Error: Unable to run mongodbCleaner script e = ${e}`))
        }

        // Start the application after the database connection is ready
        server.start(({port}) => console.log(`Server is running on port = ${port}`))
    });
