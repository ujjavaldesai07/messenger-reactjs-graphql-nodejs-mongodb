import pkg from "graphql-yoga"
import {Conversation, UserProfile} from "./model.js";

const {PubSub} = pkg;
export const pubsub = new PubSub()

export const resolvers = {
    Query: {
        conversations: async (parent, {channel_id}) => {
            const res = await Conversation.findOne({channel_id: channel_id})
            if(res) {
                return res.messages
            }
            return null
        },
    },
    Mutation: {
        postConversation: async (_, {channel_id, message, user_name}) => {
            const res = await Conversation.findOneAndUpdate(
                {channel_id: channel_id},
                {$push: {"messages": [{message: message, user_name: user_name}]}},
                {new: true, upsert: true, rawResult: true})

            console.log(`res = ${JSON.stringify(res.value.messages)}`)

            // if no error then insertion is successful and return the object
            if (res.lastErrorObject.updatedExisting) {
                console.log(`[addConversation] conversation is added successfully for channel_id = ${channel_id}....`)
                pubsub.publish(channel_id, {conversations: res.value.messages})
                return {message: message, user_name: user_name}
            }

            console.log(`[addConversation] Fail to add conversation for channel_id = ${channel_id}....`)
            return null
        },
        addUserProfile: async (_, {user_name}) => {
            const res = await UserProfile.findOneAndUpdate(
                {user_name: user_name},
                {user_name: user_name, friends: []},
                {new: true, upsert: true, rawResult: true})

            // if no error then insertion is successful and return the object
            if (!res.lastErrorObject.updatedExisting) {
                console.log(`[addUserProfile] UserProfile for ${user_name} is added successfully....`)
                return {user_name: user_name, friends: []}
            }
            console.log(`[addUserProfile] Fail to add User Profile for ${user_name}....`)
            return null
        },
        addFriend: async (_, {user_name, friend_user_name}) => {
            try {
                const channel_id = Date.now()

                // add new user profile
                let res = await UserProfile.findOneAndUpdate(
                    {user_name: user_name},
                    {$push: {"friends": [{friend_user_name: friend_user_name, channel_id: channel_id}]}},
                    {new: true, upsert: true, rawResult: true})

                console.log(`res = ${JSON.stringify(res)}`)

                // if no error then insertion is successful and return the object
                if (res.lastErrorObject.updatedExisting) {

                    // add this new profile in friend's profile
                    await UserProfile.findOneAndUpdate(
                        {user_name: friend_user_name},
                        {$push: {"friends": [{friend_user_name: user_name, channel_id: channel_id}]}},
                        {new: true, upsert: true, rawResult: true})

                    const conversation = new Conversation({channel_id: channel_id, messages: []})

                    // add new conversation channel
                    await conversation.save()

                    console.log(`[AddFriend] Friend is added successfully....`)
                    return {friend_user_name: friend_user_name, channel_id: channel_id}
                }

                console.log(`[AddFriend] Fail to add friend....`)
                return null
            } catch (err) {
                console.log(`[addFriend] An error occurred while adding new friend err msg = ${err}`)
                return null
            }

        }
    },
    Subscription: {
        conversations: {
            subscribe: async (parent, {channel_id}, {pubsub}) => {
                console.log(`[Subscription] conversations subscribe() channel_id = ${channel_id}`)
                const res = await Conversation.findOne({channel_id: channel_id})

                if(res) {
                    console.log(`[Subscription] conversations = ${JSON.stringify(res.messages)}`)

                    setTimeout(
                        () => pubsub.publish(channel_id, {conversations: res.messages}),
                        0)

                    console.log(`[Subscription] channel id = ${channel_id} is subscribed...`)
                    return pubsub.asyncIterator(channel_id);
                }
            }
        }
    }
};