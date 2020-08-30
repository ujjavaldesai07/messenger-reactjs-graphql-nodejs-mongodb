import {INITIAL_NOTIFICATION_STATE} from "../constants/constants";
import {
    NEW_REQUEST_NOTIFICATION,
    ACCEPTED_REQUEST_NOTIFICATION,
    PENDING_REQUEST_NOTIFICATION, REMOVE_NOTIFICATION, REQUEST_NOTIFICATION, EXCLUDE_SEARCH_SUGGESTIONS
} from "../actions/types";

export const notificationReducer = (state
                                        = INITIAL_NOTIFICATION_STATE, action) => {
    switch (action.type) {
        case NEW_REQUEST_NOTIFICATION:
            return {
                ...state, newRequests: [...state.newRequests, action.payload.newRequests],
                requestNotification: action.payload.requestNotification
            }

        case ACCEPTED_REQUEST_NOTIFICATION:
            
            if (state.newRequests.length > 0) {
                state.newRequests = state.newRequests.filter(
                    newRequest => newRequest.channel_id !== action.payload.acceptedRequests.channel_id)
            }

            if (state.pendingRequests.length > 0) {
                state.pendingRequests = state.pendingRequests.filter(
                    pendingRequest => pendingRequest.channel_id !== action.payload.acceptedRequests.channel_id)
            }

            if (!state.acceptedRequests) {
                return {
                    ...state, acceptedRequests: [action.payload.acceptedRequests],
                    requestNotification: action.payload.requestNotification
                }
            }

            return {
                ...state, acceptedRequests: [...state.acceptedRequests, action.payload.acceptedRequests],
                requestNotification: action.payload.requestNotification
            }

        case PENDING_REQUEST_NOTIFICATION:
            return {
                ...state, pendingRequests: [...state.pendingRequests, action.payload.pendingRequests],
                requestNotification: action.payload.requestNotification
            }

        case REQUEST_NOTIFICATION:
            return {...state, requestNotification: action.payload.requestNotification}

        case REMOVE_NOTIFICATION:
            return {newRequests: [], acceptedRequests: [], pendingRequests: [], requestNotification: null}

        default:
            return state;
    }
};

export const excludeSearchSuggestionsReducer = (state
                                        = new Map(), action) => {
    switch (action.type) {
        case EXCLUDE_SEARCH_SUGGESTIONS:
            return new Map([...state].concat([...action.payload]))
        default:
            return state;
    }
};