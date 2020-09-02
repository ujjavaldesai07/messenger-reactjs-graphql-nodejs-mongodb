import {useEffect} from "react";
import log from "loglevel";
import {
    ACCEPTED_TEXT, ACTIVE_FRIEND_COOKIE,
    PENDING_TEXT, REQUESTED_TEXT, SELF_TEXT,
} from "../constants/constants";
import {
    REQUEST_NOTIFICATION, EXCLUDE_SEARCH_SUGGESTIONS, ACTIVE_FRIEND_NAME
} from "../actions/types";
import {useDispatch, useSelector} from "react-redux";
import Cookies from "js-cookie";

/**
 * Custom hook to subscribe notifications.
 *
 * @param queriedUserProfile
 * @param queriedUserProfileLoading
 * @param enqueueSnackbar
 */
export function useQueriedUserProfile(queriedUserProfile, queriedUserProfileLoading, enqueueSnackbar) {
    /**
     * Update redux store, snackbars and search suggestions with new subscribed data
     * received from user_name channel
     */
    const dispatch = useDispatch()
    const excludeSearchSuggestions = useSelector(state => state.excludeSearchSuggestionsReducer)
    const activeUsername = useSelector(state => state.activeUsernameReducer.user_name)
    const {friend_user_name} = useSelector(state => state.friendSelectionReducer)

    const excludeRequestOptionFromFriends = (requestType, text, searchSuggestionMap) => {
        if (requestType.length > 0) {
            requestType.forEach(({friend_user_name}) => {
                if (!excludeSearchSuggestions.has(friend_user_name)) {
                    searchSuggestionMap.set(friend_user_name, ACCEPTED_TEXT)
                }
            })
        }
    }

    /**
     * Update search suggestions with new queriedUserProfile data
     * received from user_name channel
     */
    useEffect(() => {
        log.info(`[useQueriedUserProfile] Component did mount hook for queriedUserProfile dependency`)
        log.info(`[useQueriedUserProfile] queriedUserProfile = ${JSON.stringify(queriedUserProfile)}`)

        try {
            if (!queriedUserProfileLoading && queriedUserProfile.userProfile.friends) {
                let tempSearchSuggestions = new Map()
                if (!excludeSearchSuggestions.has(activeUsername)) {
                    tempSearchSuggestions.set(activeUsername, SELF_TEXT)
                }

                const {acceptedRequests, pendingRequests, newRequests} = queriedUserProfile.userProfile.friends

                excludeRequestOptionFromFriends(acceptedRequests, ACCEPTED_TEXT, tempSearchSuggestions)
                excludeRequestOptionFromFriends(pendingRequests, PENDING_TEXT, tempSearchSuggestions)
                excludeRequestOptionFromFriends(newRequests, REQUESTED_TEXT, tempSearchSuggestions)

                if (acceptedRequests.length === 0) {
                    enqueueSnackbar("Welcome to messenger ! Start finding new friends online.",
                        {
                            variant: "info",
                            autoHideDuration: 5000,
                            preventDuplicate: true
                        })
                } else if (!friend_user_name) {

                    dispatch({
                        type: ACTIVE_FRIEND_NAME,
                        payload: acceptedRequests[0]
                    })

                    Cookies.set(ACTIVE_FRIEND_COOKIE, acceptedRequests[0], {expires: 7})
                }

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
        } catch (e) {
            log.info(`[useQueriedUserProfile] queriedUserProfile.userProfile.friends in undefined
            queriedUserProfile = ${JSON.stringify(queriedUserProfile)}`)
        }

        // eslint-disable-next-line
    }, [queriedUserProfile])
}