import {INITIAL_NOTIFICATION_STATE} from "../constants/constants";
import {
    NEW_REQUEST_NOTIFICATION,
    ACCEPTED_REQUEST_NOTIFICATION,
    PENDING_REQUEST_NOTIFICATION, REMOVE_NOTIFICATION, REQUEST_NOTIFICATION
} from "../actions/types";
import log from 'loglevel'

export const notificationReducer = (state
                                        = INITIAL_NOTIFICATION_STATE, action) => {
    switch (action.type) {
        case NEW_REQUEST_NOTIFICATION:
            return {
                ...state, newRequests: [...state.newRequests, action.payload.newRequests],
                requestNotification: action.payload.requestNotification
            }

        case ACCEPTED_REQUEST_NOTIFICATION:
            log.info(`Before state = ${JSON.stringify(state)}`)

            log.info(`state.newRequests.length = ${state.newRequests.length}`)
            if (state.newRequests.length > 0) {
                state.newRequests = state.newRequests.filter(
                    newRequest => newRequest.channel_id !== action.payload.acceptedRequests.channel_id)
            }

            log.info(`state.pendingRequests.length = ${state.pendingRequests.length}`)
            if (state.pendingRequests.length > 0) {
                state.pendingRequests = state.pendingRequests.filter(
                    pendingRequest => pendingRequest.channel_id !== action.payload.acceptedRequests.channel_id)
            }

            log.info(`After state = ${JSON.stringify(state)}`)
            if (!state.acceptedRequests) {
                return {
                    ...state, acceptedRequests: [action.payload.acceptedRequests],
                    requestNotification: action.payload.requestNotification
                }
            }

            log.info(`trying to update state = ${JSON.stringify(action.payload)}`)
            log.info({
                ...state, acceptedRequests: [...state.acceptedRequests, action.payload.acceptedRequests],
                requestNotification: action.payload.requestNotification
            })

            log.info(`Updated is successful...`)

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