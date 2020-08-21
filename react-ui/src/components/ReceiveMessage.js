import React from 'react';
import {Message} from "./Message";
import {Grid} from "@material-ui/core";
import {RECEIVE_DIRECTION} from "../constants/constants";
import {UserAvatar} from "./UserAvatar";

export function ReceiveMessage() {
    return (
        <Grid container justify="flex-start" alignItems="center">
            <Grid item style={{marginRight: 10}}>
                <UserAvatar/>
            </Grid>
            <Grid item xs={6}>
                <Message direction={RECEIVE_DIRECTION}/>
            </Grid>
        </Grid>
    )
}