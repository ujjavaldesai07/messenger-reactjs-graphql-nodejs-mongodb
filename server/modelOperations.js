import {UserProfile} from "./model.js";

/**
 * create friend request with pending status in user profile
 * @param user_name
 * @param friend_user_name
 * @param channel_id
 * @param requestStatus
 * @param requestPropertyType
 * @returns {Promise<null|*>}
 */
export const updateSendRequestQuery = async (user_name, friend_user_name,
                                             channel_id, requestStatus, requestPropertyType) => {

    const requestTypePath = `request_notification.${requestPropertyType}`
    const updateRequestStatus = await UserProfile.findOneAndUpdate(
        {
            user_name: user_name,
            friends: {"$not": {"$elemMatch": {"friend_user_name": friend_user_name}}}
        },
        {
            $push: {
                "friends": [{
                    friend_user_name: friend_user_name,
                    channel_id: channel_id,
                    request_status: requestStatus
                }]
            },
            $inc: {
                [requestTypePath]: 1
            }
        },
        {new: true})

    console.log(`updateRequestStatus = ${JSON.stringify(updateRequestStatus)}`)

    if (updateRequestStatus) {
        return updateRequestStatus
    }
    return null
}

/**
 * Accept friend request and change status to accepted in friend's profile
 * @param user_name
 * @param friend_user_name
 * @param requestStatus
 * @param requestPropertyType
 * @returns {Promise<void>}
 */
export const updateAcceptRequestQuery = async (user_name, friend_user_name, requestStatus, requestPropertyType) => {

    const requestTypePath = `request_notification.${requestPropertyType}`

    // decrement the request once we changed the status.
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

    const updateAcceptRequestResult = await UserProfile.findOneAndUpdate(
        {
            user_name: user_name,
            [requestTypePath]: {$gte: 0},
            friends: {"$elemMatch": {"friend_user_name": friend_user_name, request_status: requestStatus}}
        },
        {
            $set: {"friends.$.request_status": "accepted"}
        },
        {
            new: true,
            projection: {
                "friends": {
                    $elemMatch: {"friend_user_name": friend_user_name}
                },
                request_notification: 1
            }
        })

    console.log(`updateAcceptRequestResult = ${JSON.stringify(updateAcceptRequestResult)}`)

    if (updateAcceptRequestResult) {
        return updateAcceptRequestResult
    }

    return null
}