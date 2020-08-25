import {gql} from "@apollo/client";

export const POST_CONVERSATION = gql`
mutation ($channel_id:ID!, $message:String!, $user_name: String!) {
  postConversation(channel_id: $channel_id, message: $message, user_name: $user_name) {
    message,
    user_name
   }
}
`

export const GET_CONVERSATION = gql`
subscription ($channel_id: ID!) {
  conversations (channel_id: $channel_id) {
    user_name,
    message
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

export const ADD_FRIEND = gql`
mutation ($user_name:String!, $friend_user_name:String!) {
  addFriend(user_name: $user_name, friend_user_name: $friend_user_name) {
    friend_user_name,
    channel_id
  }
}
`
