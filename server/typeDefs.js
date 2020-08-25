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
    friend_user_name: ID!
}

type UserProfile {
    user_name: String!
    friends: [Friend]
}

type Conversation {
    message: String!
    user_name: String!
}

type Query {
    friends(user_name: String!): [Friend]
    userProfiles: [UserProfile]
    userProfile(user_name: String!): [UserProfile]
    conversations(channel_id: ID!): [Conversation]
}

type Mutation {
    addUserProfile(user_name: String!): UserProfile
    addFriend(user_name: String!, friend_user_name: String!): Friend
    postConversation(channel_id: ID!, message: String!, user_name: String!): Conversation
}

type Subscription {
    conversations (channel_id: ID!): [Conversation]
}
`;
