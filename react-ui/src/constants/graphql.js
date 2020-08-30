import {gql} from "@apollo/client";

// queries
export const GET_USER_PROFILE = gql`
query ($user_name:String!) {
  userProfile(user_name: $user_name) {
    request_notification {
      newRequests
      pendingRequests
    }
    friends {
      channel_id
      friend_user_name
      request_status
    }
  }
}
`

export const GET_FRIEND_SUGGESTIONS = gql`
    query ($prefix:String!) {
    friendSuggestions(prefix: $prefix)
}
`

// mutations
export const POST_CONVERSATION = gql`
mutation ($channel_id:ID!, $message:String!, $user_name: String!) {
  postConversation(channel_id: $channel_id, message: $message, user_name: $user_name) {
    message
    user_name
   }
}
`

export const ADD_USER_PROFILE = gql`
mutation ($user_name:String!, $password:String!) {
  addUserProfile(user_name:$user_name, password:$password){
    failure
    error_msg
  }
}
`

export const SEND_FRIEND_REQUEST = gql`
mutation ($user_name:String!, $friend_user_name:String!) {
  sendFriendRequest(user_name: $user_name, friend_user_name: $friend_user_name) {
    request_notification {
      pendingRequests
      newRequests
    }
    friend {
      channel_id
      friend_user_name
      request_status
    }
  }
}
`

export const ACCEPT_FRIEND_REQUEST = gql`
mutation ($user_name:String!, $friend_user_name:String!) {
  acceptFriendRequest(user_name: $user_name, friend_user_name: $friend_user_name) {
    request_notification {
      pendingRequests
      newRequests
    }
    friend {
      channel_id
      friend_user_name
      request_status
    }
  }
}
`

export const RESET_NOTIFICATION = gql`
mutation ($user_name:String!, $notification_name:String!) {
    resetNotification(user_name: $user_name, notification_name: $notification_name) {
        request_notification {
          pendingRequests
          newRequests
        }
    }
}
`

// subscriptions
export const GET_CONVERSATION = gql`
subscription ($channel_id: ID!, $user_name: String!) {
  conversations (channel_id: $channel_id, user_name: $user_name) {
    user_name,
    message
  }
}
`

export const GET_APP_NOTIFICATION = gql`
subscription ($user_name: String!) {
  app_notifications (user_name: $user_name) {
    request_notification {
        newRequests
        pendingRequests
      }
    friend {
      channel_id
      friend_user_name
      request_status
    }
  }
}
`