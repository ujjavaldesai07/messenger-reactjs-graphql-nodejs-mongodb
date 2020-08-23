import React, {useRef} from 'react';
import {useMutation} from '@apollo/client';
import {Grid} from "@material-ui/core";
import backgroundImage from '../images/background.jpg'
import {CHAT_WINDOW_PADDING, DRAWER_WIDTH} from "../constants/constants";
import log from "loglevel";
import {MessageBox} from "./MessageBox";
import {Conversation} from "./Conversation";
import {POST_MESSAGES} from "../constants/graphql";
import {useSelector} from "react-redux";

export function ChatWindow(props) {
    const [activeUserState, setActiveUserState] = React.useState({name: 'Jack', content: ''});
    const [postMessage] = useMutation(POST_MESSAGES)
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const sidebarPadding = sidebarDrawerStatus ? DRAWER_WIDTH + 14 : CHAT_WINDOW_PADDING
    const scrollViewRef = useRef(null);

    const onMessageSend = (state) => {
        log.info(`onMessageSend = ${JSON.stringify(state)}`)
        postMessage({
            variables: state
        }).then(() => setActiveUserState({name: state.name, content: state.content}))

        log.info(`setActiveUserState = ${JSON.stringify({name: state.name, content: state.content})}`)
    }

    log.info(`[ChatWindow] Rendering ChatWindow Component....`)
    return (
        <>
            <Grid container ref={scrollViewRef}
                  style={{
                      background: `linear-gradient( rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6) ), url(${backgroundImage})`,
                      top: 60,
                      bottom: 60,
                      overflow: "auto",
                      padding: `6em 1em 6em ${sidebarPadding}px`,
                  }}>
                <Grid container style={{height: "fit-content"}}>
                    <Conversation activeUserState={activeUserState} scrollViewRef={scrollViewRef}/>
                </Grid>
            </Grid>
            <MessageBox onMessageSend={onMessageSend} sidebarPadding={sidebarPadding - 14}/>
        </>
    )
}