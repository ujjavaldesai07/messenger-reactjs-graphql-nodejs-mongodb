import {friendSuggestionMap} from "../constants.js";
import {db} from "../server.js";

export const queries = {
    conversations: async (parent, {channel_id}) => {
        console.log(`[conversations] conversations query is invoked....`)
        // get all messages from the respective channel
        const conversations = await db.collection("conversations").findOne({channel_id: channel_id})

        if (conversations) {
            return conversations.messages
        }
        return null
    },
    friend: async (parent, {user_name, friend_user_name}) => {

        // get friend's profile based on user_name and friend's name
        const friend = await db.collection("userprofiles").aggregate([
            {
                $match: {
                    user_name: user_name,
                    $expr: {
                        $gt: [{$size: "$friends"}, 0]
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
                                $eq: ["$$friend.friend_user_name", friend_user_name]
                            }
                        }
                    }
                }
            },
            {
                $project:
                    {
                        data: {$arrayElemAt: ["$friends", 0]},
                    }
            }
        ])
        console.log(`[friend] res = ${JSON.stringify(res)}`)

        // check whether there is anything in the list
        // we dont want to access empty list.
        if (friend.length > 0) {

            // destructure friend object.
            const {channel_id, friend_user_name, request_status} = friend[0].data
            return {channel_id, friend_user_name, request_status}
        }
        return null
    },
    friends: async (parent, {user_name}) => {

        // get all friends
        const friendList = await db.collection("userprofiles").findOne({user_name: user_name})

        console.log(`res = ${JSON.stringify(friendList)}`)
        if (friendList) {
            return friendList.friends
        }
        return null
    },
    userNames: async (parent, {user_name}) => {

        // get all usernames
        const userNames = await db.collection("userprofiles").aggregate([{$match: {"user_name": {$ne: user_name}}},
            {$project: {_id: 0, user_id: "$_id", "user_name": 1}}]);

        console.log(`res = ${JSON.stringify(userNames)}`)
        if (userNames) {
            return userNames
        }
        return null
    },
    friendSuggestions: (parent, {prefix}) => {

        // get friend's suggestions.
        try {
            if (prefix !== '') {
                return friendSuggestionMap.get(prefix.toLowerCase())
            }
        } catch (e) {
            return null
        }
    },
    userProfile: async (parent, {user_name}) => {

        // get the userprofile based on user_name
        const userProfile = await db.collection("userprofiles").findOne({user_name: user_name})

        console.log(`[userProfile] userProfile = ${JSON.stringify(userProfile)}`)
        if (userProfile) {
            return userProfile
        }
        return null
    }
}