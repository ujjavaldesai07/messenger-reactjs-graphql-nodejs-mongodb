import React from 'react';
import {Button, Grid} from "@material-ui/core";
import log from "loglevel";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {TITLE_TEXT_COLOR} from "../../../constants/constants";
import {UserAvatar} from "../../ui/UserAvatar";
import {useSidebarStyles} from "../../../styles/sidebarStyles";

export function PendingFriendRequest({channel_id, friend_user_name}) {
    const classes = useSidebarStyles()

    log.info(`[PendingFriendRequest] Rendering PendingFriendRequest Component....`)

    return (
        <ListItem key={channel_id} id={channel_id} value={friend_user_name} style={{height: 75}}>
            <ListItemIcon style={{justifyContent: "center"}}>
                <UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
            <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/>
            <Grid item container xs={3}>
                <Button variant="outlined" disabled size="small" fullWidth
                        style={{
                            height: 30, fontSize: "0.7rem", color: TITLE_TEXT_COLOR,
                            borderColor: TITLE_TEXT_COLOR
                        }}>
                    Pending
                </Button>
            </Grid>
        </ListItem>
    )
}

