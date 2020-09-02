import React from 'react';
import {Grid} from "@material-ui/core";
import log from "loglevel";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    ACTIVE_FRIEND_COOKIE,
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR,
    USER_AUTH_COOKIE
} from "../../../constants/constants";
import {useSidebarStyles} from "../../../styles/sidebarStyles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Cookies from "js-cookie";
import {
    ACTIVE_FRIEND_NAME,
    ACTIVE_USER_CREDENTIALS,
    REMOVE_NOTIFICATION
} from "../../../actions/types";
import history from "../../../history";
import {useDispatch, useSelector} from "react-redux";

export function LogoutButton() {
    const classes = useSidebarStyles()
    const dispatch = useDispatch()
    let excludeSearchSuggestions = useSelector(state => state.excludeSearchSuggestionsReducer)
    /**
     * On logout remove all the cookies and cleanup all redux states.
     */
    const handleLogout = () => {
        Cookies.remove(USER_AUTH_COOKIE)
        Cookies.remove(ACTIVE_FRIEND_COOKIE)

        dispatch({
            type: ACTIVE_USER_CREDENTIALS,
            payload: null
        })

        dispatch({
            type: ACTIVE_FRIEND_NAME,
            payload: {
                channel_id: 0,
                friend_user_name: null
            }
        })

        dispatch({
            type: REMOVE_NOTIFICATION
        })

        excludeSearchSuggestions.clear()

        history.push("/login")
    }

    log.info(`[LogoutButton] Rendering LogoutButton Component....`)

    return (
        <Grid container style={{
            position: "absolute", bottom: 5, height: `fit-content`,
            backgroundColor: TOOLBAR_PANEL_COLOR, color: TITLE_TEXT_COLOR
        }}>
            <ListItem button onClick={handleLogout}>
                <ListItemIcon><ExitToAppIcon fontSize="large" style={{color: TITLE_TEXT_COLOR}}/></ListItemIcon>
                <ListItemText primary="Logout" classes={{primary: classes.titlePrimaryText}}/>
            </ListItem>
        </Grid>
    )
}

