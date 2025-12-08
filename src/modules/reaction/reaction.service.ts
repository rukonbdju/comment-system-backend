import { ConflictError, NotFoundError } from "../../utils/custom-errors";
import { emitReactionUpdate } from "../../websocket/ws.manager";
import CommentRepository from "../comment/comment.repository";
import { CreateReactionDTO, ReactionRepository } from "./reaction.repository";


export const ReactionService = {
    /** * Handles adding a user's reaction to a target.
     * This is the core business logic.
     */
    handleReaction: async (data: CreateReactionDTO) => {
        const { userId, targetType, targetId, reactionType } = data;

        // 1. Check for existing reaction
        const existingReaction = await ReactionRepository.findByUserAndTarget(userId, targetId);
        if (existingReaction) {
            throw new ConflictError('User has already reacted to this target.');
        }
        try {
            const newReaction = await ReactionRepository.create(data);

            if (reactionType === 'like') {
                const updated = await CommentRepository.updateCount(targetId, reactionType, 1);
                if (updated) {
                    emitReactionUpdate("Comment_" + String(updated?._id), { targetId: String(updated?._id), likeCount: updated?.likeCount, dislikeCount: updated?.dislikeCount })
                }
            }
            if (reactionType === 'dislike') {
                const updated = await CommentRepository.updateCount(targetId, reactionType, -1);
                if (updated) {
                    emitReactionUpdate("Comment_" + String(updated?._id), { targetId: String(updated?._id), likeCount: updated?.likeCount, dislikeCount: updated?.dislikeCount })
                }
            }
            return { status: 'created', reaction: newReaction };

        } catch (error: any) {
            // If the unique index fails right after the check (race condition)
            if (error.code === 11000) {
                throw new ConflictError('User has already reacted to this target.');
            }
            throw error;
        }
    }
}