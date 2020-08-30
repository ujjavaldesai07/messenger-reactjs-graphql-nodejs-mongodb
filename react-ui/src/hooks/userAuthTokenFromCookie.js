import {useEffect} from "react";
import log from "loglevel";
import Cookies from "js-cookie";
import {ACTIVE_FRIEND_COOKIE, USER_AUTH_COOKIE} from "../constants/constants";
import {ACTIVE_USER_CREDENTIALS, ACTIVE_FRIEND_NAME} from "../actions/types";
import history from "../history";
import {useDispatch} from "react-redux";

export function useAuthTokenFromCookie(activeUsername, activeFriendName) {
    const dispatch = useDispatch()

    useEffect(() => {
        log.info(`[useAuthTokenFromCookie] custom hook is called...`)

        if (!activeUsername) {

            const storedCredentials = Cookies.get(USER_AUTH_COOKIE)
            if (storedCredentials) {
                log.info(`[useAuthTokenFromCookie] username is dispatched...`)

                try {
                    dispatch({
                        type: ACTIVE_USER_CREDENTIALS,
                        payload: JSON.parse(storedCredentials)
                    })
                } catch (e) {
                    log.error(`Unable to parse stored credentials.`)
                    return
                }

                if (!activeFriendName) {
                    const storedActiveFriend = Cookies.get(ACTIVE_FRIEND_COOKIE)
                    if (storedActiveFriend) {
                        try {
                            dispatch({
                                type: ACTIVE_FRIEND_NAME,
                                payload: JSON.parse(storedActiveFriend)
                            })
                        } catch (e) {
                            log.error(`Unable to parse stored active friend.`)
                            return
                        }
                    }
                }

                if (history.location.search.localeCompare("/") !== 0) {
                    history.push("/")
                }
            }
        }
    }, [activeUsername, dispatch, activeFriendName])
}