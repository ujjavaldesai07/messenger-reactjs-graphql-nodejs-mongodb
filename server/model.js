import mongoose from "mongoose";

export const UserProfile = mongoose.model("UserProfile", {
    user_name: {type: String, index: true, required: true},
    friends: [
        {
            channel_id: Number,
            friend_user_name: String,
            request_status: String
        }
    ],
});

export const Conversation = mongoose.model("Conversation", {
    channel_id: {type: Number, index: true, required: true},
    messages: [
        {
            message: String,
            user_name: String,
        }
    ]
});