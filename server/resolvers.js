import pkg from "graphql-yoga"
import {Conversation, UserProfile} from "./model.js";

const {PubSub} = pkg;
export const pubsub = new PubSub()
let friendSuggestionList = new Map()

export const resolvers = {
    Query: {
        conversations: async (parent, {channel_id}) => {
            const res = await Conversation.findOne({channel_id: channel_id})
            if (res) {
                return res.messages
            }
            return null
        },
        friend: async (parent, {user_name, friend_user_name}) => {
            const res = await UserProfile.aggregate([
                {
                    $match: {
                        user_name: user_name,
                        $expr: {
                            $gt: [ { $size: "$friends" }, 0 ]
                        }
                    }
                },
                {
                    $addFields: {
                        friends: {
                            $filter: {
                                input: "$friends",
                                as: "friend",
                                cond: {
                                    $eq: [ "$$friend.friend_user_name", friend_user_name ]
                                }
                            }
                        }
                    }
                },
                {
                    $project:
                        {
                            data: { $arrayElemAt: [ "$friends", 0 ] },
                        }
                }
            ])
            console.log(`[friend] res = ${JSON.stringify(res)}`)

            if (res.length > 0) {
                const {channel_id, friend_user_name, request_status} = res[0].data
                return {channel_id, friend_user_name, request_status}
            }
            return null
        },
        friends: async (parent, {user_name}) => {
            const res = await UserProfile.findOne({user_name: user_name})
            console.log(`res = ${JSON.stringify(res)}`)
            if (res) {
                return res.friends
            }
            return null
        },
        userNames: async (parent, {user_name}) => {
            const res = await UserProfile.aggregate([{$match: {"user_name": {$ne: user_name}}},
                {$project: {_id: 0, user_id: "$_id", "user_name": 1}}]);
            console.log(`res = ${JSON.stringify(res)}`)
            if (res) {
                return res
            }
            return null
        },
        friendSuggestions: (parent, {prefix}) => {
            try {
                if (prefix.length !== '') {
                    return friendSuggestionList.get(prefix.toLowerCase())
                }
            } catch (e) {
                return null
            }
        },
        userProfile: async (parent, {user_name}) => {
            const res = await UserProfile.findOne({user_name: user_name})
            console.log(`[userProfile] res = ${JSON.stringify(res)}`)
            if (res) {
                return res
            }
            return null
        }
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
                console.log(`[postConversation] conversation is added successfully for channel_id = ${channel_id}....`)
                pubsub.publish(channel_id, {conversations: res.value.messages})
                return {message: message, user_name: user_name}
            }

            console.log(`[postConversation] Fail to add conversation for channel_id = ${channel_id}....`)
            return null
        },
        addUserProfile: async (_, {user_name}) => {

            const res1 = await UserProfile.findOne({user_name: user_name})

            console.log(`[addUserProfile] res1 = ${JSON.stringify(res1)}`)

            if (!res1) {
                const userProfile = new UserProfile({user_name: user_name, friends: []})
                const res2 = await userProfile.save()

                console.log(`[addUserProfile] res2 = ${JSON.stringify(res2)}`)
                if (res2) {
                    for (let index = 1; index <= user_name.length; index++) {
                        let prefix = user_name.slice(0, index).toLowerCase()
                        if (!friendSuggestionList.has(prefix)) {
                            friendSuggestionList.set(prefix, [user_name])
                            continue
                        }
                        friendSuggestionList.get(prefix).push(user_name)
                    }

                    console.log(`[addUserProfile] UserProfile for ${user_name} is added successfully....`)
                    return {user_name: user_name, friends: []}
                }
            }

            console.log(`[addUserProfile] User Profile for ${user_name} already exist....`)
            return null
        },
        sendFriendRequest: async (_, {user_name, friend_user_name}) => {
            try {
                console.log(`[SendFriendRequest] SendFriendRequest is invoked....`)

                if (user_name.localeCompare(friend_user_name) === 0) {
                    console.log(`[SendFriendRequest] Error: friend_user_name and user_name are identical....`)
                    return null
                }

                const channel_id = Date.now()
                const userData = {
                    friend_user_name: friend_user_name,
                    channel_id: channel_id,
                    request_status: "pending"
                }

                // create friend request with pending status in user profile
                let res1 = await UserProfile.updateOne(
                    {
                        user_name: user_name,
                        friends: {"$not": {"$elemMatch": {"friend_user_name": friend_user_name}}}
                    },
                    {
                        $push: {
                            "friends": [userData]
                        }
                    },
                )

                console.log(`[SendFriendRequest] res1 = ${JSON.stringify(res1)}`)

                // if no error then insertion is successful and return the object
                if (res1.nModified === 1) {
                    const friendData = {
                        friend_user_name: user_name,
                        channel_id: channel_id,
                        request_status: "new request"
                    }

                    // create friend request with pending status in friend's profile
                    let res2 = await UserProfile.updateOne(
                        {
                            user_name: friend_user_name,
                            friends: {"$not": {"$elemMatch": {"friend_user_name": user_name}}}
                        },
                        {
                            $push: {
                                "friends": [friendData]
                            }
                        })

                    console.log(`[SendFriendRequest] res2 = ${JSON.stringify(res2)}`)
                    if (res2.nModified === 1) {
                        console.log(`[SendFriendRequest] Friend Status changed to pending successfully....`)

                        console.log(`[SendFriendRequest]  publishing to channel = ${friend_user_name}, data = ${friendData}`)
                        pubsub.publish(friend_user_name, {notifications: friendData})

                        return userData
                    }
                }

                console.log(`[SendFriendRequest] Fail to friend status changed to pending....`)
                return null
            } catch (err) {
                console.log(`[SendFriendRequest] An error occurred while sending friend request err msg = ${err}`)
                return null
            }

        },
        acceptFriendRequest: async (_, {user_name, friend_user_name}) => {
            try {
                console.log(`[AcceptFriendRequest] AcceptFriendRequest is invoked....`)

                if (user_name.localeCompare(friend_user_name) === 0) {
                    console.log(`[AcceptFriendRequest] Error: friend_user_name and user_name are identical....`)
                    return null
                }

                // accept friend request and change status to accepted in friend's profile
                let res1 = await UserProfile.updateOne(
                    {
                        user_name: user_name,
                        friends: {"$elemMatch": {"friend_user_name": friend_user_name, request_status: "new request"}}
                    },
                    {$set: {"friends.$.request_status": "accepted"}},
                    {upsert: true})

                console.log(`[AcceptFriendRequest] res1 = ${JSON.stringify(res1)}`)

                // if no error then insertion is successful and return the object
                if (res1.nModified === 1) {

                    // accept friend request and change status to accepted in user's profile
                    let res2 = await UserProfile.findOneAndUpdate(
                        {
                            user_name: friend_user_name,
                            friends: {"$elemMatch": {"friend_user_name": user_name, request_status: "pending"}}
                        },
                        {$set: {"friends.$.request_status": "accepted"}},
                        {new: true, upsert: true, rawResult: true})

                    console.log(`[AcceptFriendRequest] res2 = ${JSON.stringify(res2)}`)
                    if (res2.lastErrorObject.updatedExisting) {
                        console.log(`res = ${JSON.stringify(res2)}`)

                        let channel_id = res2.value.friends[0].channel_id
                        console.log(`channel_id = ${channel_id}`)

                        const conversation = new Conversation({channel_id: channel_id, messages: []})

                        // add new conversation channel
                        await conversation.save()

                        const friendData = {
                            friend_user_name: friend_user_name,
                            channel_id: channel_id,
                            request_status: "accepted"
                        }

                        pubsub.publish(friend_user_name, {
                            friend: {
                                friend_user_name: user_name,
                                channel_id: channel_id,
                                request_status: "accepted"
                            }
                        })

                        console.log(`[AcceptFriendRequest] Friend Status changed to accepted successfully....`)
                        return friendData
                    }
                }

                console.log(`[AcceptFriendRequest] Fail to friend status changed to accepted....`)
                return null
            } catch (err) {
                console.log(`[AcceptFriendRequest] An error occurred while accepting friend request err msg = ${err}`)
                return null
            }

        }
    },
    Subscription: {
        conversations: {
            subscribe: async (parent, {channel_id, user_name}, {pubsub}) => {
                console.log(`[Subscription] user_name = ${user_name} subscribes conversations channel_id = ${channel_id}`)
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
        notifications: {
            subscribe: async (parent, {user_name}, {pubsub}) => {
                console.log(`[Subscription] notifications subscribe() user_name = ${user_name}`)
                return pubsub.asyncIterator(user_name);
            }
        }
    }
};