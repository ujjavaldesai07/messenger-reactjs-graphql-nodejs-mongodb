import {Conversation, UserProfile} from "../model.js";
import {friendSuggestionList} from "../constants.js";

export const queries = {
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
            if (prefix !== '') {
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
}