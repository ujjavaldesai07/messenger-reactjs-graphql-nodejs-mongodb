import React from 'react';
import {ChatBubbleMessage} from "./ChatBubbleMessage";
import {Grid} from "@material-ui/core";
import {UserAvatar} from "./UserAvatar";
import log from "loglevel";
import {SENDER_CHAT_BUBBLE_BACKGROUND} from "../../constants/constants";

export function SendMessage(props) {
    log.info(`[SendMessage] Rendering SendMessage Component....`)
    return (
        <Grid container justify="flex-end" alignItems="center">
            <Grid item xs={6} container justify="flex-end">
                <ChatBubbleMessage content={props.content} background={SENDER_CHAT_BUBBLE_BACKGROUND}
                                   fontColor="white"/>
            </Grid>
            <Grid item style={{marginLeft: 10}}>
                <UserAvatar size="lg" name={props.name} background={SENDER_CHAT_BUBBLE_BACKGROUND}
                            fontColor="white"/>
            </Grid>
        </Grid>
    )
}

function sendMessagePropsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
}

export const MemoizedSendMessage = React.memo(SendMessage, sendMessagePropsAreEqual);

