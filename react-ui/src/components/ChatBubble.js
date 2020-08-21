import React from 'react';
import {Grid} from "@material-ui/core";

export function ChatBubble() {
    return (
        <Grid className="chat-bubble-speech" container style={{backgroundColor: "#3f51b5",
            color: "white",
            padding: "0.5em",
            borderRadius: "10px"
            }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque culpa cumque dolor dolorem impedit inventore laudantium, libero molestias nam natus nobis possimus quaerat, quisquam saepe soluta, ullam voluptatem! Ab, molestias.
        </Grid>
    )
}