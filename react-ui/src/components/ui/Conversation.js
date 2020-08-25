import React from 'react';
import {Grid} from "@material-ui/core";
import log from "loglevel";
import {MemoizedSendMessage} from "./SendMessage";
import {MemoizedReceiveMessage} from "./ReceiveMessage";
import {useSelector} from "react-redux";
import {useSubscription} from "@apollo/client";
import {GET_CONVERSATION} from "../../constants/graphql";
import {getChannelId} from "../../constants/constants";

export function Conversation({scrollViewRef, activeFriendName}) {
    const activeUsername = useSelector(state => state.activeUsernameReducer)
    const {data, loading} = useSubscription(GET_CONVERSATION, {
        variables: {channel_id: getChannelId(activeUsername, activeFriendName)}
    })

    const renderConversation = () => {
        log.info(`activeUserState = ${activeUsername}, loading = ${loading}, data = ${JSON.stringify(data)}`)

        if (loading || !data
            || (data && (!data.conversations)) || data.conversations.length === 0 ) {
            return null
        }

        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }, 5)
        }

        let count = 0
        return data.conversations.map(({user_name, message}) => {
            ++count
            // log.info(`activeUsername = ${activeUsername}, user_name = ${user_name}, activeFriendName = ${activeFriendName}`)
            if (activeUsername.localeCompare(user_name) === 0) {
                return (
                    <Grid key={count} container style={{paddingBottom: 10}}>
                        <MemoizedSendMessage content={message} name={user_name}/>
                    </Grid>
                )
            } else if (activeFriendName.localeCompare(user_name) === 0) {
                return (
                    <Grid key={count} container style={{paddingBottom: 10}}>
                        <MemoizedReceiveMessage content={message} name={user_name}/>
                    </Grid>
                )
            } else {
                return null
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