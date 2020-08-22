const _ = require('lodash')
const {GraphQLServer, PubSub} = require('graphql-yoga')

const messages = [];

// graphql schema
const typeDefs = `
type Message {
    id: ID!
    user: String!
    content: String!
}

type Query {
    messages: [Message!]
}

type Mutation {
    postMessage(user: String!, content: String!): ID!
}

type Subscription {
    messages: [Message!]
}
`;

const subscribers = []
const onMessagesUpdates = (fn) => subscribers.push(fn);
const pubsub = new PubSub()

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Message: {

    },
    Mutation: {
        postMessage: (parent, {user, content}) => {
            console.log(`[Mutation] postMessage() user = ${user}, content = ${content}`)
            const id = messages.length;
            messages.push({
                id,
                user,
                content
            });
            subscribers.forEach((fn) => fn())
            return id
        }
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, {pubsub}) => {
                const channel = Math.random().toString(36).slice(2,15)
                console.log(`[Subscription] subscribe() channel = ${channel}`)

                // subscribe channel
                onMessagesUpdates(() => pubsub.publish(channel, {messages}))

                // sent the message immediately after subscribing it.
                setTimeout(() => pubsub.publish(channel, {messages}), 0)

                console.log(`[Subscription] subscribe() message sent...`)
                return pubsub.asyncIterator(channel);
            }
        }
    }
};

const server = new GraphQLServer({typeDefs, resolvers, context: { pubsub }});

server.start(({port}) => {
    console.log(`Server on http://localhost:${port}/`);
});