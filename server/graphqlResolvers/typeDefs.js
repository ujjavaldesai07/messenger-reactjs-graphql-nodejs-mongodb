// graphql schema
export const typeDefs = `
type TotalRequestNotification {
    newRequests: Int
    pendingRequests: Int
}

type Friend {
    channel_id: ID
    friend_user_name: ID
}

type Friends {
    acceptedRequests: [Friend]
    newRequests: [Friend]
    pendingRequests: [Friend]
}

type AppNotifications {
    request_notification: TotalRequestNotification
    friends: Friends
}

type UserProfile {
    user_name: String!
    request_notification: TotalRequestNotification
    friends: Friends
}

type Conversation {
    message: String!
    user_name: String!
}

type UserName {
    user_id: ID!
    user_name: String!
}

type VerificationStatus {
    failure: Boolean!
    error_msg: String
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
    addUserProfile(user_name: String!, password: String!): VerificationStatus
    sendFriendRequest(user_name: String!, friend_user_name: String!): AppNotifications
    resetNotification(user_name: String!, notification_name: String!): AppNotifications
    acceptFriendRequest(user_name: String!, friend_user_name: String!): AppNotifications
    postConversation(channel_id: ID!, message: String!, user_name: String!): Conversation
    verifyAuthentication(user_name: ID!, password: String, token: String): VerificationStatus
}

type Subscription {
    conversations (channel_id: ID!, user_name: String!): [Conversation]
    app_notifications (user_name: String!): AppNotifications
}
`;
