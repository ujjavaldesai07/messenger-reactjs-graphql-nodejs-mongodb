import {useEffect} from "react";
import log from "loglevel";
import {
    ACCEPTED_TEXT, ACTIVE_FRIEND_COOKIE,
    PENDING_TEXT, REQUESTED_TEXT,
    SNACKBAR_AUTO_HIDE_DURATION,
} from "../constants/constants";
import {
    NEW_REQUEST_NOTIFICATION,
    ACCEPTED_REQUEST_NOTIFICATION,
    PENDING_REQUEST_NOTIFICATION,
    REQUEST_NOTIFICATION,
    EXCLUDE_SEARCH_SUGGESTIONS,
    ACTIVE_FRIEND_NAME
} from "../actions/types";
import {useDispatch, useSelector} from "react-redux";
import Cookies from "js-cookie";

/**
 * Custom hook to dispatch data to redux from subscribed notifications.
 *
 * @param subscribedData
 * @param subscribedDataLoading
 * @param enqueueSnackbar
 */
export function useSubscriptionNotification(subscribedData, subscribedDataLoading, enqueueSnackbar) {
    /**
     * Update redux store, snackbars and search suggestions with new subscribed data
     * received from user_name channel
     */
    const dispatch = useDispatch()
    const excludeSearchSuggestions = useSelector(state => state.excludeSearchSuggestionsReducer)

    useEffect(() => {
        log.info(`[useSubscriptionNotification] Component did mount hook for subscribedData dependency`)
        log.info(`[useSubscriptionNotification] subscribedData = ${JSON.stringify(subscribedData)},
         notificationLoading = ${subscribedDataLoading}`)

        // store temp search suggestions in map
        // so that we dont want to give option to user to send
        // friend request who is already friend.
        let tempSearchSuggestions = new Map()

        try {
            // check if data is received and is not null
            // initially we will get null data because the subscription triggers
            // after we subscribe the data.
            if (!subscribedDataLoading && subscribedData.app_notifications.friends) {
                // destructure subscribe data
                let {friends, request_notification} = subscribedData.app_notifications
                let {acceptedRequests, newRequests, pendingRequests} = friends

                if (acceptedRequests && acceptedRequests.length > 0) {
                    acceptedRequests.forEach(friend => {
                        // if user_name not added then add it.
                        if (!excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, ACCEPTED_TEXT)
                        }

                        // update the snackbar notification
                        enqueueSnackbar(`[Request Accepted] You and ${friend.friend_user_name} are now friends.`,
                            {
                                variant: "success",
                                autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
                                preventDuplicate: true
                            })

                        // dispatch new request notification and later render it with new data
                        // in right tab.
                        dispatch({
                            type: ACCEPTED_REQUEST_NOTIFICATION,
                            payload: {acceptedRequests: friend, requestNotification: request_notification}
                        })
                    })

                    dispatch({
                        type: ACTIVE_FRIEND_NAME,
                        payload: acceptedRequests[0]
                    })

                    Cookies.set(ACTIVE_FRIEND_COOKIE, acceptedRequests[0], {expires: 7})
                }

                if (newRequests && newRequests.length > 0) {
                    newRequests.forEach(friend => {
                        // if user_name not added then add it.
                        if (!excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, PENDING_TEXT)
                        }

                        // update the snackbar notification
                        enqueueSnackbar(`[New Request Notification] Received from ${friend.friend_user_name}.`,
                            {
                                variant: "info",
                                autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
                                preventDuplicate: true
                            })

                        // dispatch new request notification and later render it with new data
                        // in right tab.
                        dispatch({
                            type: NEW_REQUEST_NOTIFICATION,
                            payload: {newRequests: friend, requestNotification: request_notification}
                        })
                    })
                }

                if (pendingRequests && pendingRequests.length > 0) {
                    log.info(`[useSubscriptionNotification] pendingRequests = ${JSON.stringify(pendingRequests)}`)
                    pendingRequests.forEach(friend => {
                        if (!excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, REQUESTED_TEXT)
                        }

                        enqueueSnackbar(`[Friend Request Sent] Friend request sent to ${friend.friend_user_name}.`,
                            {
                                variant: "success",
                                autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
                                preventDuplicate: true
                            })

                        dispatch({
                            type: PENDING_REQUEST_NOTIFICATION,
                            payload: {pendingRequests: friend, requestNotification: request_notification}
                        })
                    })
                }

                if (tempSearchSuggestions.size > 0) {

                    // append the state of maps
                    // with new map in order redux to render again
                    dispatch({
                        type: EXCLUDE_SEARCH_SUGGESTIONS,
                        payload: tempSearchSuggestions
                    })
                }
            }
        } catch (e) {
            log.info(`[useSubscriptionNotification] subscribedData.app_notifications.friends is null
            subscribedData = ${JSON.stringify(subscribedData)}`)
        }

        try {
            if (subscribedData.app_notifications.request_notification) {

                // if publisher only sends request_notification then we will land here.
                // for eg we will land here during resetting the notification.
                dispatch({
                    type: REQUEST_NOTIFICATION,
                    payload: {requestNotification: subscribedData.app_notifications.request_notification}
                })
            }
        } catch (e) {
            log.info(`[useSubscriptionNotification] subscribedData.app_notifications.request_notification is null
             subscribedData = ${JSON.stringify(subscribedData)}`)
        }

        // we want to update only when subscribedData changes
        // eslint-disable-next-line
    }, [subscribedData])
}