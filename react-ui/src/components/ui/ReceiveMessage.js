import React from 'react';
import {ChatBubbleMessage} from "./ChatBubbleMessage";
import {Grid} from "@material-ui/core";
import {UserAvatar} from "./UserAvatar";
import log from "loglevel";
import {RECEIVER_CHAT_BUBBLE_BACKGROUND} from "../../constants/constants";

export function ReceiveMessage(props) {
    log.info(`[ReceiveMessage] Rendering ReceiveMessage Component....`)
    return (
        <Grid container justify="flex-start" alignItems="center">
            <Grid item style={{marginRight: 10}}>
                <UserAvatar size="lg" name={props.name} background={RECEIVER_CHAT_BUBBLE_BACKGROUND}
                            fontColor="white"/>
            </Grid>
            <Grid item xs={6}>
                <ChatBubbleMessage content={props.content} background={RECEIVER_CHAT_BUBBLE_BACKGROUND}
                                   fontColor="white"/>
            </Grid>
        </Grid>
    )
}

function receiveMessagePropsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
}

export const MemoizedReceiveMessage = React.memo(ReceiveMessage, receiveMessagePropsAreEqual);