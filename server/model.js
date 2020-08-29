import mongoose from "mongoose";

export const UserProfile = mongoose.model("UserProfile", {
    user_name: {type: String, index: true, required: true},
    request_notification: {
        newRequests: Number,
        pendingRequests: Number,
    },
    friends: [
        {
            channel_id: Number,
            friend_user_name: String,
            request_status: String,
            newly_joined: Boolean,
            last_message: String,
            last_message_timestamp: Date,
            total_unread_messages: Number
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