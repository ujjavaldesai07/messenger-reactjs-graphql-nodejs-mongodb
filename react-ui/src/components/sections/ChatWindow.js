import React from 'react';
import {useMutation} from '@apollo/client';
import {Grid} from "@material-ui/core";
import backgroundImage from '../../images/background.jpg'
import {
    CHAT_WINDOW_PADDING,
    DRAWER_WIDTH,
    SIDEBAR_PADDING,
    TOP_BOTTOM_POSITION
} from "../../constants/constants";
import log from "loglevel";
import {MessageBox} from "../ui/MessageBox";
import {Conversation} from "../ui/Conversation";
import {POST_CONVERSATION} from "../../constants/graphql";
import {useSelector} from "react-redux";

export function ChatWindow() {
    const {user_name: activeUsername} = useSelector(state => state.activeUsernameReducer)
    const {channel_id, friend_user_name} = useSelector(state => state.friendSelectionReducer)
    const [postMessage] = useMutation(POST_CONVERSATION)
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const sidebarPadding = sidebarDrawerStatus ? DRAWER_WIDTH + CHAT_WINDOW_PADDING : SIDEBAR_PADDING

    log.info(`[ChatWindow] activeUsername = ${activeUsername}, friend_user_name = ${friend_user_name}`)
    if (!activeUsername || !friend_user_name) {
        return null
    }

    const onMessageSend = (message) => {
        const state = {
            message: message,
            user_name: activeUsername,
            channel_id: channel_id,
        }

        log.info(`onMessageSend = ${JSON.stringify(state)}`)

        postMessage({
            variables: state
        }).catch(e => log.error(`[POST MESSAGE]: Unable to post message to graphql server e = ${e}`))
    }

    log.info(`[ChatWindow] Rendering ChatWindow Component...`)
    return (
        <Grid container style={{position: "absolute", bottom: TOP_BOTTOM_POSITION, height: `93%`}}>
            <Grid container
                  style={{
                      background: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${backgroundImage})`,
                      top: TOP_BOTTOM_POSITION,
                      bottom: TOP_BOTTOM_POSITION,
                      overflow: "auto",
                      padding: `3em 1em 6em ${sidebarPadding}px`,
                      position: "relative",
                  }}>
                <Grid container style={{height: "fit-content"}}>
                    <Conversation channel_id={channel_id}
                                  activeFriendName={friend_user_name}/>
                </Grid>
            </Grid>
            <MessageBox onMessageSend={onMessageSend}
                        sidebarPadding={sidebarPadding - CHAT_WINDOW_PADDING}/>

        </Grid>
    )
}