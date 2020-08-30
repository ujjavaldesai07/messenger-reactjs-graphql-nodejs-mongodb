import {useEffect} from "react";
import log from "loglevel";
import {
    ACCEPTED_TEXT,
    PENDING_TEXT, REQUESTED_TEXT, SELF_TEXT,
} from "../constants/constants";
import {
    REQUEST_NOTIFICATION, EXCLUDE_SEARCH_SUGGESTIONS
} from "../actions/types";
import {useDispatch, useSelector} from "react-redux";

/**
 * Custom hook to subscribe notifications.
 *
 * @param queriedUserProfile
 * @param queriedUserProfileLoading
 */
export function useQueriedUserProfile(queriedUserProfile, queriedUserProfileLoading) {
    /**
     * Update redux store, snackbars and search suggestions with new subscribed data
     * received from user_name channel
     */
    const dispatch = useDispatch()
    const excludeSearchSuggestions = useSelector(state => state.excludeSearchSuggestionsReducer)
    const activeUsername = useSelector(state => state.activeUsernameReducer.user_name)

    /**
     * Update search suggestions with new queriedUserProfile data
     * received from user_name channel
     */
    useEffect(() => {
        log.info(`[SideBar] Component did mount hook for queriedUserProfile dependency`)
        log.info(`[SideBar] queriedUserProfile = ${JSON.stringify(queriedUserProfile)}`)

        if (!queriedUserProfileLoading && queriedUserProfile && queriedUserProfile.userProfile) {
            let tempSearchSuggestions = new Map()
            if (!excludeSearchSuggestions.has(activeUsername)) {
                tempSearchSuggestions.set(activeUsername, SELF_TEXT)
            }
            queriedUserProfile.userProfile.friends.forEach(({request_status, channel_id, friend_user_name}) => {
                if (!excludeSearchSuggestions.has(friend_user_name)) {
                    switch (request_status.charAt(0)) {
                        case 'a':
                            tempSearchSuggestions.set(friend_user_name, ACCEPTED_TEXT)
                            break
                        case 'n':
                            tempSearchSuggestions.set(friend_user_name, PENDING_TEXT)
                            break
                        case 'p':
                            tempSearchSuggestions.set(friend_user_name, REQUESTED_TEXT)
                            break
                        default:
                            throw new Error(`[SideBar] request_status option ${request_status} not supported.`)
                    }
                }
            })

            // if we set something then dispatch it.
            if (tempSearchSuggestions.size > 0) {
                // append the state of maps
                // with new map in order redux to render again
                dispatch({
                    type: EXCLUDE_SEARCH_SUGGESTIONS,
                    payload: tempSearchSuggestions
                })
            }

            // dispatch notification to redux store
            // so that we dont have to maintain notification
            // from queriedUserProfile and subscribed data.
            // its better to store data in redux store.
            dispatch({
                type: REQUEST_NOTIFICATION,
                payload: {requestNotification: queriedUserProfile.userProfile.request_notification}
            })
        }

        // eslint-disable-next-line
    }, [queriedUserProfile])
}