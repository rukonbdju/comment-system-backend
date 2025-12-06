import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["Comment", "Reply"], required: true, index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    reactionType: { type: String, enum: ["like", "dislike"], required: true },
    createdAt: { type: Date, default: Date.now, index: true }
});

reactionSchema.index(
    { user: 1, targetType: 1, targetId: 1 },
    { unique: true }
);

export default mongoose.model("Reaction", reactionSchema);
