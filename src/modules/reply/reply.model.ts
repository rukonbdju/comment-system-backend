import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true, index: true },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: "Reply", default: null },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Reply", replySchema);
