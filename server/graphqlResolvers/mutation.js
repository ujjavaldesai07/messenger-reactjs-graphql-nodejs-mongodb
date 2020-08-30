import {Conversation, UserProfile} from "../model.js";
import {updateAcceptRequestQuery, updateSendRequestQuery} from "../modelOperations.js";
import {pubsub, friendSuggestionList} from "../constants.js";

export const mutations = {
    postConversation: async (_, {channel_id, message, user_name}) => {
        console.log(`postConversation Invoked by user_name = ${user_name}`)
        const res = await Conversation.findOneAndUpdate(
            {channel_id: channel_id},
            {$push: {"messages": [{message: message, user_name: user_name}]}},
            {new: true, upsert: true})

        console.log(`res = ${JSON.stringify(res)}`)

        // if no error then insertion is successful and return the object
        if (res) {
            console.log(`[postConversation] conversation is added successfully for channel_id = ${channel_id}....`)
            pubsub.publish(channel_id, {conversations: res.messages})
            return {message: message, user_name: user_name}
        }

        console.log(`[postConversation] Fail to add conversation for channel_id = ${channel_id}....`)
        return null
    },
    resetNotification: async (_, {user_name, notification_name}) => {
        console.log(`[resetNotification] user_name = ${user_name}, notification_name = ${notification_name}`)
        const notificationFieldPath = `request_notification.${notification_name}`
        const res = await UserProfile.findOneAndUpdate(
            {user_name: user_name},
            {
                $set: {
                    [notificationFieldPath]: 0
                }
            },
            {new: true})

        try {
            console.log(`[resetNotification] res = ${JSON.stringify(res)}`)

            console.log(`[resetNotification] resetNotification is published successfully...`)
            return {request_notification: res.request_notification}

        } catch (e) {
            console.log(`[resetNotification] Fail to reset notification e = ${e}`)
        }
    },
    addUserProfile: async (_, {user_name}) => {

        const res1 = await UserProfile.findOne({user_name: user_name})

        console.log(`[addUserProfile] res1 = ${JSON.stringify(res1)}`)

        if (!res1) {
            const userProfile = new UserProfile({
                user_name: user_name,
                request_notification: {newRequests: 0, pendingRequests: 0}, friends: []
            })

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
                return userProfile
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

            // create friend request with pending status in user profile
            const userSendQueryResult = await updateSendRequestQuery(user_name, friend_user_name, channel_id,
                "pending", "pendingRequests")

            console.log(`[SendFriendRequest] userSendQueryResult = ${JSON.stringify(userSendQueryResult)}`)

            // if no error then insertion is successful and return the object
            if (userSendQueryResult) {

                // create friend request with pending status in friend's profile
                const friendSendQueryResult = await updateSendRequestQuery(friend_user_name, user_name, channel_id,
                    "new request", "newRequests")

                console.log(`[SendFriendRequest] friendSendQueryResult = ${JSON.stringify(friendSendQueryResult)}`)

                if (friendSendQueryResult) {
                    const otherUserNewFriend = friendSendQueryResult.friends[friendSendQueryResult.friends.length-1]

                    // friend request activity
                    pubsub.publish(friend_user_name, {
                        app_notifications: {
                            request_notification: friendSendQueryResult.request_notification,
                            friend: {
                                channel_id: otherUserNewFriend.channel_id,
                                friend_user_name: otherUserNewFriend.friend_user_name,
                                request_status: otherUserNewFriend.request_status
                            }
                        }
                    })

                    console.log(`[SendFriendRequest] Friend Status changed to pending successfully....`)

                    const userNewFriend = userSendQueryResult.friends[userSendQueryResult.friends.length-1]
                    return {
                        request_notification: userSendQueryResult.request_notification,
                        friend: {
                            channel_id: userNewFriend.channel_id,
                            friend_user_name: userNewFriend.friend_user_name,
                            request_status: userNewFriend.request_status
                        }
                    }
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
            console.log(`[AcceptFriendRequest] AcceptFriendRequest is invoked user_name = ${user_name},friend_user_name = ${friend_user_name} ....`)

            if (user_name.localeCompare(friend_user_name) === 0) {
                console.log(`[AcceptFriendRequest] Error: friend_user_name and user_name are identical....`)
                return null
            }

            const userAcceptQueryResult = await updateAcceptRequestQuery(user_name, friend_user_name,
                "new request", "newRequests")

            console.log(`[AcceptFriendRequest] userAcceptQueryResult = ${JSON.stringify(userAcceptQueryResult)}`)

            // if no error then insertion is successful and return the object
            if (userAcceptQueryResult) {

                const friendAcceptQueryResult = await updateAcceptRequestQuery(friend_user_name, user_name,
                    "pending", "pendingRequests")

                console.log(`[AcceptFriendRequest] friendAcceptQueryResult = ${JSON.stringify(friendAcceptQueryResult)}`)

                if (friendAcceptQueryResult) {
                    // const channel_id = friendAcceptQueryResult.[0].channel_id
                    const channel_id = friendAcceptQueryResult.friends[0].channel_id
                    const conversation = new Conversation({
                        channel_id: channel_id, messages: []})

                    // add new conversation channel
                    await conversation.save()

                    // friend request activity
                    pubsub.publish(friend_user_name, {
                        app_notifications: {
                            request_notification: friendAcceptQueryResult.request_notification,
                            friend: {
                                friend_user_name: user_name,
                                channel_id: channel_id,
                                request_status: "accepted"
                            }
                        }
                    })

                    console.log(`[AcceptFriendRequest] Friend Status changed to accepted successfully....`)
                    return {
                        request_notification: userAcceptQueryResult.request_notification,
                        friend: {
                            channel_id: channel_id,
                            friend_user_name: friend_user_name,
                            request_status: "accepted"
                        }
                    }
                }
            }

            console.log(`[AcceptFriendRequest] Fail to friend status changed to accepted....`)
            return null
        } catch (err) {
            console.log(`[AcceptFriendRequest] An error occurred while accepting friend request err msg = ${err}`)
            return null
        }

    }
}