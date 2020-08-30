import {ACTIVE_USER_CREDENTIALS} from "../actions/types";

export const activeUsernameReducer = (state
                                          = {user_name: null, password: null}, action) => {
    switch (action.type) {
        case ACTIVE_USER_CREDENTIALS:
            return action.payload
        default:
            return state;
    }
};