// graphql schema
export const typeDefs = `
type Message {
    id: ID!
    user: String!
    content: String!
    chatPartner: String!
}

type Friend {
    channel_id: ID!
    friend_user_name: ID!,
    request_status: String!
}

type UserProfile {
    user_name: String!
    friends: [Friend]
}

type Conversation {
    message: String!
    user_name: String!
}

type UserName {
    user_id: ID!,
    user_name: String!
}

type Query {
    friend(user_name: String!, friend_user_name: String!): Friend
    friends(user_name: String!): [Friend]
    userNames(user_name: String!): [UserName]
    friendSuggestions(prefix: String!): [String]
    userProfile(user_name: String!): UserProfile
    conversations(channel_id: ID!): [Conversation]
}

type Mutation {
    addUserProfile(user_name: String!): UserProfile
    sendFriendRequest(user_name: String!, friend_user_name: String!): Friend
    acceptFriendRequest(user_name: String!, friend_user_name: String!): Friend
    postConversation(channel_id: ID!, message: String!, user_name: String!): Conversation
}

type Subscription {
    conversations (channel_id: ID!, user_name: String!): [Conversation]
    notifications (user_name: String!): Friend
}
`;
