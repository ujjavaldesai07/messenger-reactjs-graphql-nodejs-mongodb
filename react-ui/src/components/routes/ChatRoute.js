import React from 'react';
import {SideBar} from "../sections/Sidebar";
import log from "loglevel";
import {ChatWindow} from "../sections/ChatWindow";

function ChatRoute() {
    log.info(`[ChatRoute] Rendering ChatRoute Component....`)

    return (
        <>
            <SideBar/>
            <ChatWindow/>
        </>
    );
}

export default ChatRoute;
