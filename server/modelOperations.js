import {UserProfile} from "./model.js";

/**
 * create friend request with pending status in user profile
 * @param user_name
 * @param friend_user_name
 * @param channel_id
 * @param requestPropertyType
 * @returns {Promise<null|*>}
 */
export const updateSendRequestQuery = async (user_name, friend_user_name,
                                             channel_id, requestPropertyType) => {

    // create field path based on property name
    const requestTypePath = `request_notification.${requestPropertyType}`
    const friendRequestTypePath = `friends.${requestPropertyType}`

    // find One and update the status
    const updateRequestStatus = await UserProfile.findOneAndUpdate(
        {
            user_name: user_name,
            [friendRequestTypePath]: {"$not": {"$elemMatch": {"friend_user_name": friend_user_name}}}
        },
        {
            $push: {
                [friendRequestTypePath]: {
                    friend_user_name: friend_user_name,
                    channel_id: channel_id
                }
            },
            $inc: {
                [requestTypePath]: 1
            }
        },
        {new: true})

    console.log(`updateRequestStatus = ${JSON.stringify(updateRequestStatus)}`)

    // if success then return the object
    if (updateRequestStatus) {
        return updateRequestStatus
    }
    return null
}

/**
 * Accept friend request and change status to accepted in friend's profile
 * @param user_name
 * @param friend_user_name
 * @param channel_id
 * @param requestPropertyType
 * @returns {Promise<void>}
 */
export const updateAcceptRequestQuery = async (user_name, friend_user_name, channel_id, requestPropertyType) => {

    const requestTypePath = `request_notification.${requestPropertyType}`
    const friendRequestTypePath = `friends.${requestPropertyType}`

    // decrement the request first so that we can get the correct
    // notification number.
    await UserProfile.updateOne(
        {
            user_name: user_name,
            [requestTypePath]: {$gt: 0},
        },
        {
            $inc: {
                [requestTypePath]: -1
            }
        })

    // now update the status
    const updateAcceptRequestResult = await UserProfile.findOneAndUpdate(
        {
            user_name: user_name,
            [requestTypePath]: {$gte: 0},
            [friendRequestTypePath]: {
                "$elemMatch": {
                    "friend_user_name": friend_user_name
                }
            }
        },
        {
            $pull: {
                [friendRequestTypePath]: {
                    friend_user_name: friend_user_name
                }
            },
            $push: {
                "friends.acceptedRequests": {
                    friend_user_name: friend_user_name,
                    channel_id: channel_id
                }
            },
        },
        {new: true, multi: true})

    console.log(`updateAcceptRequestResult = ${JSON.stringify(updateAcceptRequestResult)}`)

    if (updateAcceptRequestResult) {
        return updateAcceptRequestResult
    }

    return null
}

export const getChannelIDByUsernameAndFriendName
    = async (user_name, friend_user_name, requestPropertyType) => {

    const friendRequestTypePath = `friends.${requestPropertyType}`
    const friendRequestTypeArrayElementPath = `${friendRequestTypePath}.$`

    const friendObject = await UserProfile.findOne({
            user_name: user_name,
            [friendRequestTypePath]: {"$elemMatch": {"friend_user_name": friend_user_name}}
        },
        {[friendRequestTypeArrayElementPath]: 1})

    console.log(`[getChannelIDByUsernameAndFriendName] friendObject = ${JSON.stringify(friendObject)}`)

    if (friendObject) {
        return friendObject.friends[requestPropertyType][0].channel_id
    }
    return null
}