import pkg from "graphql-yoga";
const {PubSub} = pkg;

export const friendSuggestionMap = new Map();
export const pubsub = new PubSub();