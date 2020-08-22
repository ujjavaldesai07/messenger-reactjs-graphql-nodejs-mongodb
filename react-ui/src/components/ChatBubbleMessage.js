import React, {useEffect} from 'react';
import {Grid} from "@material-ui/core";
import log from 'loglevel';

export function ChatBubbleMessage(props) {

    // useEffect(() => {
    //     log.info(`[ChatBubbleMessage] Component did mount`)
    //     window.scrollTo({
    //         bottom: 1000,
    //         behavior: 'smooth'
    //     })
    // }, [props])

    log.info(`[ChatBubbleMessage] Rendering ChatBubbleMessage Component....`)
    return (
        <Grid className="chat-bubble-speech" container style={{backgroundColor: "#3f51b5",
            color: "white",
            padding: "0.5em",
            borderRadius: "10px",
            width: "fit-content"
        }}>
            {props.content}
        </Grid>
    )
}