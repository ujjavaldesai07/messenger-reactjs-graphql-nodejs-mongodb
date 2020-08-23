import {ACTIVE_USER_STATE} from "../actions/types";
import {INITIAL_ACTIVE_USER_STATE} from "../constants/constants";

export const activeUserReducer = (state = INITIAL_ACTIVE_USER_STATE, action) => {
    switch (action.type) {
        case ACTIVE_USER_STATE:
            return {...state, name: action.payload.name, content: action.payload.content}
        default:
            return state;
    }
};