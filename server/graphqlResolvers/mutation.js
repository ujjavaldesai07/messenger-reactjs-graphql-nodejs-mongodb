import {
    getChannelIDByUsernameAndFriendName,
    updateAcceptRequestQuery,
    updateSendRequestQuery
} from "../modelOperations.js";
import {pubsub, friendSuggestionMap} from "../constants.js";
import {db} from "../server.js"


export const mutations = {

    /**
     * store message to database and publish that message to respective subscriber.
     * @param _
     * @param channel_id
     * @param message
     * @param user_name
     * @returns {Promise<null|{user_name: *, message: *}>}
     */
    postConversation: async (_, {channel_id, message, user_name}) => {
        console.log(`postConversation Invoked by user_name = ${user_name}`)
        const res = await db.collection("conversations").findOneAndUpdate(
            {channel_id: channel_id},
            {$push: {"messages": {message: message, user_name: user_name}}},
            {returnOriginal: false, upsert: true})

        console.log(`res = ${JSON.stringify(res)}`)

        // if no error_msg then insertion is successful and return the object
        if (res.hasOwnProperty("value")) {
            console.log(`[postConversation] conversation is added successfully for channel_id = ${channel_id}....`)
            pubsub.publish(channel_id, {conversations: res.value.messages})
            return {message: message, user_name: user_name}
        }

        console.log(`[postConversation] Fail to add conversation for channel_id = ${channel_id}....`)
        return null
    },

    /**
     * reset notification to 0 show it wont show to user.
     *
     * @param _
     * @param user_name
     * @param notification_name
     * @returns {Promise<{request_notification: ({newRequests: number,
     * pendingRequests: number}|{newRequests: NumberConstructor, pendingRequests: NumberConstructor}|number)}>}
     */
    resetNotification: async (_, {user_name, notification_name}) => {
        console.log(`[resetNotification] user_name = ${user_name}, notification_name = ${notification_name}`)
        const notificationFieldPath = `request_notification.${notification_name}`
        const res = await db.collection("userprofiles").findOneAndUpdate(
            {user_name: user_name},
            {
                $set: {
                    [notificationFieldPath]: 0
                }
            },
            {returnOriginal: false})

        try {
            console.log(`[resetNotification] res = ${JSON.stringify(res)}`)

            console.log(`[resetNotification] resetNotification is published successfully...`)
            return {request_notification: res.value.request_notification}

        } catch (e) {
            console.log(`[resetNotification] Fail to reset notification e = ${e}`)
        }
    },
    /**
     * Create new user and if already exist then check the user_name
     * @param _
     * @param user_name
     * @param password
     * @returns {Promise<{error_msg: null, failure: boolean}|{error_msg: string, failure: boolean}>}
     */
    addUserProfile: async (_, {user_name, password}) => {

        // check if user_name present
        const findUserProfileResult = await db.collection("userprofiles").findOne({user_name: user_name})

        console.log(`[addUserProfile] findUserProfileResult = ${JSON.stringify(findUserProfileResult)}`)

        if (!findUserProfileResult) {
            const userProfile = {
                user_name: user_name,
                password: password,
                request_notification: {newRequests: 0, pendingRequests: 0},
                friends: {
                    acceptedRequests: [],
                    newRequests: [],
                    pendingRequests: []
                }
            }

            // create new user
            const createUserProfileResult = await db.collection("userprofiles").insertOne(userProfile)

            console.log(`[addUserProfile] createUserProfileResult = ${JSON.stringify(createUserProfileResult)}`)
            if (createUserProfileResult) {
                for (let index = 1; index <= user_name.length; index++) {
                    let prefix = user_name.slice(0, index).toLowerCase()
                    if (!friendSuggestionMap.has(prefix)) {
                        friendSuggestionMap.set(prefix, [user_name])
                        continue
                    }
                    friendSuggestionMap.get(prefix).push(user_name)
                }

                console.log(`[addUserProfile] UserProfile for ${user_name} is added successfully....`)
                return {failure: false, error_msg: null}
            }
        } else {
            if (password.localeCompare(findUserProfileResult.password) === 0) {
                // success
                return {failure: false, error_msg: null}
            } else {
                // failure on no match
                return {failure: true, error_msg: "Username & Password didn't matched"}
            }
        }

        // if we get any database error_msg
        return {failure: true, error_msg: "Database connection failure."}
    },
    sendFriendRequest: async (_, {user_name, friend_user_name}) => {
        try {
            console.log(`[SendFriendRequest] SendFriendRequest is invoked....`)

            // create channel_id
            const channel_id = Date.now()

            // create friend request with pending status in user profile
            const userSendQueryResult = await updateSendRequestQuery(user_name,
                friend_user_name, channel_id, "pendingRequests")

            console.log(`[SendFriendRequest] userSendQueryResult = ${JSON.stringify(userSendQueryResult)}`)

            // if no error_msg then insertion is successful and return the object
            if (userSendQueryResult) {

                // create friend request with pending status in friend's profile
                const friendSendQueryResult = await updateSendRequestQuery(friend_user_name,
                    user_name, channel_id, "newRequests")

                console.log(`[SendFriendRequest] friendSendQueryResult = ${JSON.stringify(friendSendQueryResult)}`)

                if (friendSendQueryResult) {
                    const friendProfileNewRequests = friendSendQueryResult.friends.newRequests
                    // new friend will always be push at the end.
                    const friendProfileNewRequest = friendProfileNewRequests[friendProfileNewRequests.length - 1]

                    // publish this object to subscribed friend's profile
                    pubsub.publish(friend_user_name, {
                        app_notifications: {
                            request_notification: friendSendQueryResult.request_notification,
                            friends: {
                                newRequests: [{
                                    channel_id: friendProfileNewRequest.channel_id,
                                    friend_user_name: friendProfileNewRequest.friend_user_name
                                }]
                            }
                        }
                    })

                    console.log(`[SendFriendRequest] Friend Status changed to pending successfully....`)

                    // return this user object to user
                    const userProfilePendingRequests = userSendQueryResult.friends.pendingRequests
                    const userProfilePendingRequest = userProfilePendingRequests[userProfilePendingRequests.length - 1]

                    return {
                        request_notification: userSendQueryResult.request_notification,
                        friends: {
                            pendingRequests: [{
                                channel_id: userProfilePendingRequest.channel_id,
                                friend_user_name: userProfilePendingRequest.friend_user_name
                            }]
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

            const channel_id = await getChannelIDByUsernameAndFriendName(user_name, friend_user_name, "newRequests")

            console.log(`[AcceptFriendRequest] channel_id = ${JSON.stringify(channel_id)}`)

            if (channel_id) {
                // update the status to user's profile with request_status update
                const userAcceptQueryResult = await updateAcceptRequestQuery(user_name, friend_user_name, channel_id,
                    "newRequests")

                console.log(`[AcceptFriendRequest] userAcceptQueryResult = ${JSON.stringify(userAcceptQueryResult)}`)

                // if no error_msg then insertion is successful and return the object
                if (userAcceptQueryResult) {

                    // new friend will always be push at the end.
                    const userProfileAcceptRequests = userAcceptQueryResult.friends.acceptedRequests
                    const userProfileAcceptRequest = userProfileAcceptRequests[userProfileAcceptRequests.length - 1]

                    // update friend's profile with request_status accepted
                    const friendAcceptQueryResult = await updateAcceptRequestQuery(friend_user_name, user_name, channel_id,
                        "pendingRequests")

                    console.log(`[AcceptFriendRequest] friendAcceptQueryResult = ${JSON.stringify(friendAcceptQueryResult)}`)

                    if (friendAcceptQueryResult) {

                        const conversation = {
                            channel_id: userProfileAcceptRequest.channel_id, messages: []
                        }

                        // create new conversation channel
                        await db.collection("conversations").insertOne(conversation)

                        // publish friend's object to subscribed friend's profile
                        pubsub.publish(friend_user_name, {
                            app_notifications: {
                                request_notification: friendAcceptQueryResult.request_notification,
                                friends: {
                                    acceptedRequests: [{
                                        friend_user_name: user_name,
                                        channel_id: userProfileAcceptRequest.channel_id
                                    }]
                                }
                            }
                        })

                        // return user's object to subscribed user's profile
                        console.log(`[AcceptFriendRequest] Friend Status changed to accepted successfully....`)
                        return {
                            request_notification: userAcceptQueryResult.request_notification,
                            friends: {
                                acceptedRequests: [{
                                    channel_id: userProfileAcceptRequest.channel_id,
                                    friend_user_name: friend_user_name
                                }]
                            }
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