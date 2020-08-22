import React from 'react';
import {gql, useMutation, useSubscription} from '@apollo/client';
import {MemoizedSendMessage} from "./SendMessage";
import {MemoizedReceiveMessage, ReceiveMessage} from "./ReceiveMessage";
import {Grid} from "@material-ui/core";
import backgroundImage from '../images/background.jpg'
import {CHAT_WINDOW_PADDING, DRAWER_WIDTH} from "../constants/constants";
import log from "loglevel";
import {MessageBox} from "./MessageBox";

const GET_MESSAGES = gql`
subscription {
  messages {
    id,
    user,
    content
  }
}
`

const POST_MESSAGES = gql`
mutation ($name:String!, $content:String!){
  postMessage(user: $name, content: $content)
}
`

export function ChatWindow(props) {
    const [activeUserState, setActiveUserState] = React.useState({name: 'Jack', content: ''});
    const {data} = useSubscription(GET_MESSAGES)
    const [postMessage] = useMutation(POST_MESSAGES)
    const paddingRight = props.drawerOpen ? DRAWER_WIDTH + 10 : CHAT_WINDOW_PADDING

    const onMessageSend = (state) => {
        log.info(`onMessageSend = ${JSON.stringify(state)}`)
        postMessage({
            variables: state
        })

        log.info(`setActiveUserState = ${JSON.stringify({name: state.name, content: state.content})}`)
        setActiveUserState({name: state.name, content: state.content})
    }

    const renderMessageInDirection = () => {
        log.info(`activeUserState = ${JSON.stringify(activeUserState)}`)

        if (!data || (data && !data.messages) || (data && data.messages.length === 0)) {
            return null
        }

        log.info(`data = ${JSON.stringify(data)}`)

        return data.messages.map(({id, user, content}) => {
            if (activeUserState.name.localeCompare(user) === 0) {
                return (
                    <Grid key={id} container style={{paddingBottom: 10}}>
                        <MemoizedSendMessage content={content} avatarInitials={user.slice(0, 2)}/>
                    </Grid>
                )
            } else {
                return (
                    <Grid key={id} container style={{paddingBottom: 10}}>
                        <MemoizedReceiveMessage content={content} avatarInitials={user.slice(0, 2)}/>
                    </Grid>
                )
            }
        })

    }

    log.info(`[ChatWindow] Rendering ChatWindow Component....`)
    return (
        <>
            <Grid container
                  style={{
                      position: "fixed",
                      background: `linear-gradient( rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6) ), url(${backgroundImage})`,
                      top: 60,
                      bottom: 60,
                      overflowY: "auto",
                      padding: `2em ${paddingRight}px 2em 1em`,
                  }}>
                <Grid container style={{height: "fit-content"}}>
                    {renderMessageInDirection()}
                </Grid>
            </Grid>
            <MessageBox onMessageSend={onMessageSend} paddingRight={paddingRight}/>
        </>
    )
}