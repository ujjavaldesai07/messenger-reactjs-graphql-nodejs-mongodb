export const SIDEBAR_PADDING = 82
export const CHAT_WINDOW_PADDING = 14
export const DRAWER_WIDTH = 250
export const TOP_BOTTOM_POSITION = 60
export const USER_AUTH_COOKIE = "CHAT_USER_AUTH"
export const ACTIVE_FRIEND_COOKIE = "CHAT_ACTIVE_FRIEND"
export const PENDING_TEXT = "Pending"
export const REQUESTED_TEXT = "Requested"
export const SELF_TEXT = "You"
export const ACCEPTED_TEXT = "Friend"

export const INITIAL_NOTIFICATION_STATE = {
    newRequests: [],
    acceptedRequests: [],
    pendingRequests: [],
    requestNotification: null
}

export const INITIAL_FRIEND_SELECTED_STATE = {
    channel_id: 0,
    friend_user_name: null
}