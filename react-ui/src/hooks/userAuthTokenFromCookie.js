import {useEffect} from "react";
import log from "loglevel";
import Cookies from "js-cookie";
import {ACTIVE_FRIEND_COOKIE, USER_AUTH_COOKIE} from "../constants/constants";
import {ACTIVE_USERNAME, FRIEND_SELECTED} from "../actions/types";
import history from "../history";
import {useDispatch} from "react-redux";

export function useAuthTokenFromCookie(activeUsername, activeFriendName) {
    const dispatch = useDispatch()

    useEffect(() => {
        log.info(`[useAuthTokenFromCookie] custom hook is called...`)

        if (!activeUsername) {

            const storedUsername = Cookies.get(USER_AUTH_COOKIE)
            if (storedUsername) {
                log.info(`[useAuthTokenFromCookie] username is dispatched...`)
                dispatch({
                    type: ACTIVE_USERNAME,
                    payload: storedUsername
                })

                if (!activeFriendName) {
                    const storedActiveFriend = Cookies.get(ACTIVE_FRIEND_COOKIE)
                    if (storedActiveFriend) {
                        dispatch({
                            type: FRIEND_SELECTED,
                            payload: JSON.parse(storedActiveFriend)
                        })
                    }
                }

                if (history.location.search.localeCompare("/") !== 0) {
                    history.push("/")
                }
            }
        }
    }, [activeUsername, dispatch, activeFriendName])
}