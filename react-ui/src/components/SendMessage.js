import React from 'react';
import {Message} from "./Message";
import {Grid} from "@material-ui/core";
import {SEND_DIRECTION} from "../constants/constants";
import {UserAvatar} from "./UserAvatar";

export function SendMessage() {
    return (
        <Grid container justify="flex-end" alignItems="center">
            <Grid item xs={6}>
                <Message direction={SEND_DIRECTION}/>
            </Grid>
            <Grid item style={{marginLeft: 10}}>
                <UserAvatar size="lg"/>
            </Grid>
        </Grid>
    )
}