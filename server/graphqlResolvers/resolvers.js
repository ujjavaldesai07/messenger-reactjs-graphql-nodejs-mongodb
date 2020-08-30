import {mutations} from "./mutation.js";
import {queries} from "./queries.js";
import {subscriptions} from "./subscriptions.js";

export const resolvers = {
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions
};