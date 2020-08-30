// hardcoded css styles
export const SIDEBAR_PADDING = 82
export const CHAT_WINDOW_PADDING = 14
export const DRAWER_WIDTH = 350
export const TOP_BOTTOM_POSITION = 60
export const USER_AUTH_COOKIE = "CHAT_USER_AUTH"
export const ACTIVE_FRIEND_COOKIE = "CHAT_ACTIVE_FRIEND"
export const PENDING_TEXT = "Pending"
export const REQUESTED_TEXT = "Requested"
export const SELF_TEXT = "You"
export const ACCEPTED_TEXT = "Friend"
export const SNACKBAR_AUTO_HIDE_DURATION = 7000

// colors
export const RECEIVER_CHAT_BUBBLE_BACKGROUND = "#3b4044"
export const SENDER_CHAT_BUBBLE_BACKGROUND = "#054740"
export const TITLE_TEXT_COLOR = "#F1F1F2EB"
export const SIDEBAR_PANEL_COLOR = "#20272b"
export const TOOLBAR_PANEL_COLOR = "#2A2F32"
export const LIST_BORDER_COLOR = "#30383d"
export const MESSAGE_SECTION_COLOR = "#1E2428"
export const NOTIFICATION_COLOR= "#09d261"
export const CARD_COLOR= "#3B4042"

// redux initial states
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