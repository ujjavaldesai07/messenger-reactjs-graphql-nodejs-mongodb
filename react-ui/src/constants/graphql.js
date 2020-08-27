import {gql} from "@apollo/client";

// queries
export const GET_MY_FRIENDS = gql`
query ($user_name:String!) {
  friends(user_name: $user_name) {
      channel_id,
      friend_user_name
      request_status
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
    message,
    user_name
   }
}
`

export const ADD_USER_PROFILE = gql`
mutation ($user_name:String!) {
  addUserProfile(user_name:$user_name){
    user_name
    friends {
      channel_id
      friend_user_name
    }
  }
}
`

export const SEND_FRIEND_REQUEST = gql`
mutation ($user_name:String!, $friend_user_name:String!) {
  sendFriendRequest(user_name: $user_name, friend_user_name: $friend_user_name) {
    friend_user_name,
    channel_id,
    request_status
  }
}
`

export const ACCEPT_FRIEND_REQUEST = gql`
mutation ($user_name:String!, $friend_user_name:String!) {
  acceptFriendRequest(user_name: $user_name, friend_user_name: $friend_user_name) {
    friend_user_name,
    channel_id,
    request_status
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

export const GET_NOTIFICATION = gql`
subscription ($user_name: String!) {
  notifications (user_name: $user_name) {
     channel_id,
    request_status,
    friend_user_name
  }
}
`
