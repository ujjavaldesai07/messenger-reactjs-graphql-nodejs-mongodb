import React from 'react';
import {Grid} from "@material-ui/core";
import log from "loglevel";
import {MemoizedSendMessage} from "./SendMessage";
import {MemoizedReceiveMessage} from "./ReceiveMessage";
import {useSubscription} from "@apollo/client";
import {GET_MESSAGES} from "../constants/graphql";
import {useSelector} from "react-redux";

export function Conversation({scrollViewRef}) {
    const {data} = useSubscription(GET_MESSAGES)
    const activeUserState = useSelector(state => state.activeUserReducer)

    const renderConversation = () => {
        log.info(`activeUserState = ${JSON.stringify(activeUserState)}`)


        if (!data || (data && !data.messages) || (data && data.messages.length === 0)) {
            return null
        }

        log.info(`data = ${JSON.stringify(data)}`)

        if(scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }, 5)
        }

        return data.messages.map(({id, user, content}) => {
            if (activeUserState.name.localeCompare(user) === 0) {
                return (
                    <Grid key={id} container style={{paddingBottom: 10}} onClick={onclick}>
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

    log.info(`[Conversation] Rendering Conversation Component....`)
    return (
        <>
            {renderConversation()}
        </>
    )
}