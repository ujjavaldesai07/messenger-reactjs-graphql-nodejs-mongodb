import {FRIEND_SELECTED, SIDEBAR_DRAWER_CLOSED, SIDEBAR_DRAWER_OPEN} from "../actions/types";
import log from 'loglevel';

export const sidebarDrawerReducer = (state = false, action) => {
    switch (action.type) {
        case SIDEBAR_DRAWER_OPEN:
            log.info(`SIDEBAR_DRAWER_OPEN`)
            return true
        case SIDEBAR_DRAWER_CLOSED:
            log.info(`SIDEBAR_DRAWER_CLOSED`)
            return false
        default:
            return state;
    }
};

export const friendSelectionReducer = (state
                                           = null, action) => {
    switch (action.type) {
        case FRIEND_SELECTED:
            return action.payload
        default:
            return state;
    }
};
