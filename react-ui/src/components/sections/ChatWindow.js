import React, {useEffect, useRef} from 'react';
import {useMutation} from '@apollo/client';
import {Grid} from "@material-ui/core";
import backgroundImage from '../../images/background.jpg'
import {
    CHAT_WINDOW_PADDING,
    DRAWER_WIDTH,
    getChannelId,
    SIDEBAR_PADDING,
    TOP_BOTTOM_POSITION
} from "../../constants/constants";
import log from "loglevel";
import {MessageBox} from "../ui/MessageBox";
import {Conversation} from "../ui/Conversation";
import {POST_CONVERSATION} from "../../constants/graphql";
import {useSelector} from "react-redux";
import {useAuthTokenFromCookie} from "../../hooks/userAuthTokenFromCookie";

export function ChatWindow() {
    const activeUsername = useSelector(state => state.activeUsernameReducer)
    const activeFriendName = useSelector(state => state.friendSelectionReducer)
    const [postMessage] = useMutation(POST_CONVERSATION)
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const sidebarPadding = sidebarDrawerStatus ? DRAWER_WIDTH + CHAT_WINDOW_PADDING : SIDEBAR_PADDING
    const scrollViewRef = useRef(null);

    useAuthTokenFromCookie(activeUsername, activeFriendName)

    if(!activeUsername) {
        return null
    }

    const onMessageSend = (message) => {
        const state = {
            message: message,
            user_name: activeUsername,
            channel_id: getChannelId(activeUsername, activeFriendName),
        }

        log.info(`onMessageSend = ${JSON.stringify(state)}`)

        postMessage({
            variables: state
        }).catch(e => log.error(`[POST MESSAGE]: Unable to post message to graphql server e = ${e}`))
    }

    log.info(`[ChatWindow] Rendering ChatWindow Component....`)
    return (
        <Grid container style={{position: "absolute", bottom: TOP_BOTTOM_POSITION, height: `92%`}}>
            <Grid container ref={scrollViewRef}
                  style={{
                      background: `linear-gradient( rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6) ), url(${backgroundImage})`,
                      top: TOP_BOTTOM_POSITION,
                      bottom: TOP_BOTTOM_POSITION,
                      overflow: "auto",
                      padding: `3em 1em 6em ${sidebarPadding}px`,
                      position: "relative",
                  }}>
                <Grid container style={{height: "fit-content"}}>
                    {activeFriendName && activeUsername ?
                        <Conversation scrollViewRef={scrollViewRef} activeFriendName={activeFriendName}/> : null}
                </Grid>
            </Grid>
            <MessageBox onMessageSend={onMessageSend} sidebarPadding={sidebarPadding - CHAT_WINDOW_PADDING}/>
        </Grid>
    )
}