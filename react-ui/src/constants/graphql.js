import {gql} from "@apollo/client";

export const POST_MESSAGES = gql`
mutation ($name:String!, $content:String!){
  postMessage(user: $name, content: $content)
}
`

export const GET_MESSAGES = gql`
subscription {
  messages {
    id,
    user,
    content
  }
}
`