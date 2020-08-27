import {INITIAL_NOTIFICATION_STATE} from "../constants/constants";
import {
    NEW_REQUEST_NOTIFICATION,
    ACCEPTED_REQUEST_NOTIFICATION,
    NOTIFICATIONS,
    PENDING_REQUEST_NOTIFICATION
} from "../actions/types";

export const notificationReducer = (state
                                           = INITIAL_NOTIFICATION_STATE, action) => {
    switch (action.type) {
        case NEW_REQUEST_NOTIFICATION:
            return {...state, newRequests: [...state.newRequests, action.payload.newRequests]}
        case ACCEPTED_REQUEST_NOTIFICATION:
            return {...state, acceptedRequests: [...state.acceptedRequests, action.payload.acceptedRequests]}
        case PENDING_REQUEST_NOTIFICATION:
            return {...state, pendingRequests: [...state.pendingRequests, action.payload.pendingRequests]}
        case NOTIFICATIONS:
            return {...state, newRequests: action.payload.newRequests,
                pendingRequests: action.payload.pendingRequests, initialized: true}
        default:
            return state;
    }
};