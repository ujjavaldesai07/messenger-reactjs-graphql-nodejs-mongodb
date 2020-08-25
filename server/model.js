import mongoose from "mongoose";

export const UserProfile = mongoose.model("UserProfile", {
    user_name: String,
    friends: [
        {
            channel_id: Number,
            friend_user_name: String
        }
    ],
});

export const Conversation = mongoose.model("Conversation", {
    channel_id: Number,
    messages: [
        {
            message: String,
            user_name: String,
        }
    ]
});