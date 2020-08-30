import {Conversation} from "../model.js";

export const subscriptions = {

    /**
     * Conversation subscription
     */
    conversations: {
        subscribe: async (parent, {channel_id, user_name}, {pubsub}) => {

            console.log(`[Subscription] user_name = ${user_name} subscribes to conversations on channel_id = ${channel_id}`)
            const conversations = await Conversation.findOne({channel_id: channel_id})

            if (conversations) {
                console.log(`[Subscription] conversations = ${JSON.stringify(conversations.messages)}`)

                // publish the data once we the event emitter is initialized with
                // tbe channel_id.
                setTimeout(
                    () => pubsub.publish(channel_id, {conversations: conversations.messages}),
                    0)

                console.log(`[Subscription] channel id = ${channel_id} is subscribed...`)
                return pubsub.asyncIterator(channel_id);
            }
        }
    },

    /**
     * General notation subscription
     */
    app_notifications: {
        subscribe: async (parent, {user_name}, {pubsub}) => {

            // just subscribe the data
            console.log(`[Subscription] user_name = ${user_name} subscribes to app_notifications`)
            return pubsub.asyncIterator(user_name);
        }
    }
}