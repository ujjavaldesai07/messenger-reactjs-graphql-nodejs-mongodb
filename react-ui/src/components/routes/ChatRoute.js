import React from 'react';
import {SideBar} from "../sections/Sidebar";
import log from "loglevel";
import {ChatWindow} from "../sections/ChatWindow";
import {useAuthTokenFromCookie} from "../../hooks/userAuthTokenFromCookie";

function ChatRoute() {
    log.info(`[ChatRoute] Rendering ChatRoute Component....`)
    useAuthTokenFromCookie(null, null)

    return (
        <>
            <SideBar/>
            <ChatWindow/>
        </>
    );
}

export default ChatRoute;
