import mongoose from "mongoose";
import { AuthError, NotFoundError } from "../../utils/custom-errors";
import { ReactionRepository } from "../reaction/reaction.repository";
import CommentRepository from "./comment.repository";


const CommentService = {
    /** Create a new comment */
    addComment: async (data: { content: string; user: string; }) => {
        return CommentRepository.create(data);
    },

    /** Get all comments with pagination */
    getAllComments: async (userId: string, page: number, limit: number, sort: string) => {
        // 1. Setup Pagination and Sorting
        const pageNum = Math.max(1, page);
        const limitNum = Math.max(1, limit);

        const { comments, totalCount } = await CommentRepository.findAll(userId, pageNum, limitNum, sort);

        const commentIds = comments.map(c => new mongoose.Types.ObjectId(c._id));

        const reactionMap = await ReactionRepository.findUserReactionsByTargetIds(userId, commentIds);

        const commentsWithReaction = comments.map(comment => {
            // Look up the reaction status for the current comment ID (O(1) lookup)
            const reactionStatus = reactionMap ? reactionMap.get(String(comment._id)) : null;

            return {
                ...comment,
                currentUserReaction: reactionStatus
            };
        });

        const totalPages = Math.ceil(totalCount / limitNum);

        return {
            comments: commentsWithReaction,
            meta: {
                totalCount,
                totalPages,
                currentPage: pageNum,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        };
    },

    /** Get a single comment by ID */
    getCommentById: async (commentId: string) => {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new NotFoundError(`Comment with ID ${commentId} not found.`);
        }
        return comment;
    },

    /** Update a comment, verifying ownership */
    updateComment: async (commentId: string, userId: string, data: { content: string }) => {
        const comment = await CommentRepository.findById(commentId);

        if (!comment) {
            throw new NotFoundError(`Comment with ID ${commentId} not found.`);
        }
        // **BUSINESS LOGIC: Check ownership**
        if (comment.user._id.toString() !== userId) {
            throw new AuthError('You do not have permission to update this comment.');
        }

        const updatedComment = await CommentRepository.update(commentId, data);
        return updatedComment;
    },

    /** Delete a comment, verifying ownership */
    deleteComment: async (commentId: string, userId: string): Promise<boolean> => {
        const comment = await CommentRepository.findById(commentId);

        if (!comment) {
            // Success, as the comment is already gone
            return true;
        }
        console.log(comment.user.toString(), userId)
        // **BUSINESS LOGIC: Check ownership**
        if (comment.user._id.toString() !== userId) {
            throw new AuthError('You do not have permission to delete this comment.');
        }

        const deleted = await CommentRepository.delete(commentId);
        return deleted;
    },
}

export default CommentService;