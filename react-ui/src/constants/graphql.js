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