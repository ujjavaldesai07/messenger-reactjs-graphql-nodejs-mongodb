import React from 'react';
import {RECEIVE_DIRECTION, SEND_DIRECTION} from "../constants/constants";
import {ChatBubble} from "./ChatBubble";

export function Message(props) {

    const renderMessage = () => {
        switch (props.direction) {
            case SEND_DIRECTION:
                return <ChatBubble/>;
            case RECEIVE_DIRECTION:
                return <ChatBubble/>;
            default:
                throw new Error("Unknown Message Direction")
        }
    }

    return (
        <div>
            {renderMessage()}
        </div>
    )
}