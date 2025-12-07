import { AuthError, NotFoundError } from "../../utils/custom-errors";
import CommentRepository from "./comment.repoisitory";


const CommentService = {
    /** Create a new comment */
    addComment: async (data: { content: string; user: string; }) => {
        return CommentRepository.create(data);
    },

    /** Get all comments with pagination */
    getAllComments: async (page: number, limit: number) => {
        // Ensure page and limit are valid numbers
        const pageNum = Math.max(1, page);
        const limitNum = Math.max(1, limit);

        const { comments, totalCount } = await CommentRepository.findAll(pageNum, limitNum);

        const totalPages = Math.ceil(totalCount / limitNum);

        return {
            comments,
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
        if (comment.user.toString() !== userId) {
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

        // **BUSINESS LOGIC: Check ownership**
        if (comment.user.toString() !== userId) {
            throw new AuthError('You do not have permission to delete this comment.');
        }

        const deleted = await CommentRepository.delete(commentId);
        return deleted;
    },
}

export default CommentService;