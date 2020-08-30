import {Conversation} from "../model.js";

export const subscriptions = {
    conversations: {
        subscribe: async (parent, {channel_id, user_name}, {pubsub}) => {
            console.log(`[Subscription] user_name = ${user_name} subscribes to conversations on channel_id = ${channel_id}`)
            const res = await Conversation.findOne({channel_id: channel_id})

            if (res) {
                console.log(`[Subscription] conversations = ${JSON.stringify(res.messages)}`)

                setTimeout(
                    () => pubsub.publish(channel_id, {conversations: res.messages}),
                    0)

                console.log(`[Subscription] channel id = ${channel_id} is subscribed...`)
                return pubsub.asyncIterator(channel_id);
            }
        }
    },
    app_notifications: {
        subscribe: async (parent, {user_name}, {pubsub}) => {
            console.log(`[Subscription] user_name = ${user_name} subscribes to app_notifications`)
            return pubsub.asyncIterator(user_name);
        }
    }
}