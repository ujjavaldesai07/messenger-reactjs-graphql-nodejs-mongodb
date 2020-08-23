import React, {useRef} from 'react';
import {useMutation} from '@apollo/client';
import {Grid} from "@material-ui/core";
import backgroundImage from '../images/background.jpg'
import {CHAT_WINDOW_PADDING, DRAWER_WIDTH, SIDEBAR_PADDING, TOP_BOTTOM_POSITION} from "../constants/constants";
import log from "loglevel";
import {MessageBox} from "./MessageBox";
import {Conversation} from "./Conversation";
import {POST_MESSAGES} from "../constants/graphql";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE_USER_STATE} from "../actions/types";

export function ChatWindow() {
    const [postMessage] = useMutation(POST_MESSAGES)
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const sidebarPadding = sidebarDrawerStatus ? DRAWER_WIDTH + CHAT_WINDOW_PADDING : SIDEBAR_PADDING
    const scrollViewRef = useRef(null);
    const dispatch = useDispatch()

    const onMessageSend = (state) => {
        log.info(`onMessageSend = ${JSON.stringify(state)}`)
        postMessage({
            variables: state
        }).then(() => dispatch({
                type: ACTIVE_USER_STATE,
                payload: state
            })
        ).catch(e => log.error(`[POST MESSAGE]: Unable to post message to graphql server e = ${e}`))
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
                    <Conversation scrollViewRef={scrollViewRef}/>
                </Grid>
            </Grid>
            <MessageBox onMessageSend={onMessageSend} sidebarPadding={sidebarPadding - CHAT_WINDOW_PADDING}/>
        </Grid>
    )
}