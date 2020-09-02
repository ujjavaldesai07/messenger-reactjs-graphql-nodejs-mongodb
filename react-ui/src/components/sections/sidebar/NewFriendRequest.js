import React from 'react';
import {Button, Grid} from "@material-ui/core";
import log from "loglevel";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    ACTIVE_FRIEND_COOKIE,
    REQUESTED_TEXT,
    SENDER_CHAT_BUBBLE_BACKGROUND,
    TITLE_TEXT_COLOR
} from "../../../constants/constants";
import {UserAvatar} from "../../ui/UserAvatar";
import {useSidebarStyles} from "../../../styles/sidebarStyles";
import {ACCEPTED_REQUEST_NOTIFICATION, ACTIVE_FRIEND_NAME, EXCLUDE_SEARCH_SUGGESTIONS} from "../../../actions/types";
import {useMutation} from "@apollo/client";
import {ACCEPT_FRIEND_REQUEST} from "../../../constants/graphql";
import {useDispatch, useSelector} from "react-redux";
import Cookies from "js-cookie";

export function NewFriendRequest({channel_id, friend_user_name}) {
    const classes = useSidebarStyles()
    const dispatch = useDispatch()
    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST)
    const activeUsername = useSelector(state => state.activeUsernameReducer.user_name)

    const acceptFriendRequestHandler = (e) => {
        acceptFriendRequest({
            variables: {
                user_name: activeUsername,
                friend_user_name: e.currentTarget.value
            }
        }).then(res => {
            if (res.data.acceptFriendRequest) {
                try {
                    const {friends, request_notification} = res.data.acceptFriendRequest
                    log.info(`[SideBar] acceptFriendRequestHandler response = ${JSON.stringify(res.data.acceptFriendRequest)}`)
                    dispatch({
                        type: ACCEPTED_REQUEST_NOTIFICATION,
                        payload: {
                            requestNotification: request_notification,
                            acceptedRequests: friends.acceptedRequests[0]
                        }
                    })

                    // On accept request change the suggestion list, so that user
                    // dont send the request again.
                    dispatch({
                        type: EXCLUDE_SEARCH_SUGGESTIONS,
                        payload: new Map([[friends.acceptedRequests[0].friend_user_name, REQUESTED_TEXT]])
                    })

                    dispatch({
                        type: ACTIVE_FRIEND_NAME,
                        payload: friends.acceptedRequests[0]
                    })

                    Cookies.set(ACTIVE_FRIEND_COOKIE, friends.acceptedRequests[0], {expires: 7})
                } catch (e) {
                    log.info(`[SearchBar] query result is null while accepting friend request
                     res.data.acceptFriendRequest = ${JSON.stringify(res.data.acceptFriendRequest)}`)
                    return null
                }
            }
        }).catch(e => log.error(`[SEND_FRIEND_REQUEST]: Unable to send friend request to graphql server e = ${e}`))
    }

    log.info(`[NewFriendRequest] Rendering NewFriendRequest Component....`)

    return (
        <ListItem key={channel_id} id={channel_id} value={friend_user_name} style={{height: 75}}>
            <ListItemIcon style={{justifyContent: "center"}}>
                <UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
            <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/>
            <Grid item container xs={3}>
                <Button variant="contained" size="small" value={friend_user_name} fullWidth
                        onClick={acceptFriendRequestHandler}
                        style={{
                            height: 30, fontSize: "0.8rem", color: TITLE_TEXT_COLOR, fontWeight: 500,
                            backgroundColor: SENDER_CHAT_BUBBLE_BACKGROUND
                        }}>
                    Accept
                </Button>
            </Grid>
        </ListItem>
    )
}

