export const SIDEBAR_PADDING = 82
export const CHAT_WINDOW_PADDING = 14
export const DRAWER_WIDTH = 250
export const TOP_BOTTOM_POSITION = 60
export const USER_AUTH_COOKIE = "CHAT_USER_AUTH"
export const ACTIVE_FRIEND_COOKIE = "CHAT_ACTIVE_FRIEND"

export const INITIAL_SUBSCRIPTION_STATE = {
    data: null,
    loading: false
}

const friendChannelInfo = new Map(
    [
        ["ujjaval", [{friendName: "mike", channelId: 1598331574482}]],
        ["mike", [{friendName: "ujjaval", channelId: 1598331574482}]],
    ]
)

export const getChannelId = (activeUsername, activeFriendInfo)  => {
    console.log(`activeUsername === ${activeUsername}`)
    if(activeUsername && activeFriendInfo) {
        let friendList = friendChannelInfo.get(activeUsername)
        if(friendList) {
            for(let index = 0; index < friendList.length; ++index) {
                if (friendList[index].friendName.localeCompare(activeFriendInfo) === 0)
                    return friendList[index].channelId
            }
        }
    }
}