import React from 'react';
import {Badge} from "@material-ui/core";
import log from "loglevel";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {UserAvatar} from "../../ui/UserAvatar";
import {useSidebarStyles} from "../../../styles/sidebarStyles";
import Cookies from "js-cookie";
import {ACTIVE_FRIEND_COOKIE} from "../../../constants/constants";
import {ACTIVE_FRIEND_NAME} from "../../../actions/types";
import {useDispatch} from "react-redux";

export function AcceptedFriendRequest({channel_id, friend_user_name, selectedFriend,
                                       newlyJoined, sidebarDrawerStatus}) {
    const classes = useSidebarStyles()
    const dispatch = useDispatch()

    /**
     * On Friend selected to chat set the cookie
     * so that we dont loose him when page is refreshed.
     * @param e
     */
    const selectFriendBtnHandler = (e) => {
        const payload = {
            channel_id: e.currentTarget.id,
            friend_user_name: e.currentTarget.getAttribute("value")
        }

        Cookies.set(ACTIVE_FRIEND_COOKIE, payload, {expires: 7})

        dispatch({
            type: ACTIVE_FRIEND_NAME,
            payload: payload
        })
    }

    log.info(`[NewFriendRequest] Rendering NewFriendRequest Component....`)

    return (
        <ListItem button key={channel_id} id={channel_id} value={friend_user_name}
                  onClick={selectFriendBtnHandler}
                  style={{height: 75, justifyContent: "center"}}
                  classes={{divider: classes.dividerRoot}}
                  divider
                  selected={selectedFriend === friend_user_name}>
            {newlyJoined ?
                <Badge badgeContent="New" color="secondary"
                       anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                    <ListItemIcon style={{justifyContent: "center"}}>
                        <UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                </Badge>
                : <ListItemIcon style={{justifyContent: "center"}}>
                    <UserAvatar size="md" name={friend_user_name}/></ListItemIcon>}
            {sidebarDrawerStatus ?
                <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/> : null}
        </ListItem>
    )
}

