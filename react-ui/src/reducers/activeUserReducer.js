import {ACTIVE_USERNAME} from "../actions/types";

export const activeUsernameReducer = (state = null, action) => {
    switch (action.type) {
        case ACTIVE_USERNAME:
            return action.payload
        default:
            return state;
    }
};