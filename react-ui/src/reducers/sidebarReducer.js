import {FRIEND_SELECTED, SIDEBAR_DRAWER_CLOSED, SIDEBAR_DRAWER_OPEN} from "../actions/types";
import log from 'loglevel';
import {INITIAL_FRIEND_SELECTED_STATE} from "../constants/constants";

export const sidebarDrawerReducer = (state = true, action) => {
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
                                           = INITIAL_FRIEND_SELECTED_STATE, action) => {
    switch (action.type) {
        case FRIEND_SELECTED:
            return {...state, channel_id: action.payload.channel_id,
                friend_user_name: action.payload.friend_user_name}
        default:
            return state;
    }
};
