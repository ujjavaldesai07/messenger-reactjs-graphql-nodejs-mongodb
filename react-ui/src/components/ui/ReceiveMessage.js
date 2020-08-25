import React from 'react';
import {ChatBubbleMessage} from "./ChatBubbleMessage";
import {Grid} from "@material-ui/core";
import {UserAvatar} from "./UserAvatar";
import log from "loglevel";

export function ReceiveMessage(props) {
    log.info(`[ReceiveMessage] Rendering ReceiveMessage Component....`)
    return (
        <Grid container justify="flex-start" alignItems="center">
            <Grid item style={{marginRight: 10}}>
                <UserAvatar size="lg" name={props.name}/>
            </Grid>
            <Grid item xs={6}>
                <ChatBubbleMessage content={props.content}/>
            </Grid>
        </Grid>
    )
}

function receiveMessagePropsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
}

export const MemoizedReceiveMessage = React.memo(ReceiveMessage, receiveMessagePropsAreEqual);