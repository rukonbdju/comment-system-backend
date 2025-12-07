import { Request, Response, NextFunction } from 'express';
import commentModel from './comment.model';
import CommentService from './comment.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const CommentController = {
    /** POST /api/comments */
    createComment: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // The userId comes from the JWT payload attached by authMiddleware
            const userId = req.user!.userId;
            const { content } = req.body;

            const newComment = await CommentService.addComment({ content, user: userId });

            res.status(201).json({
                success: true,
                message: 'Comment created successfully.',
                data: newComment
            });
        } catch (error) {
            next(error); // Pass error to the Global Error Handler
        }
    },

    /** GET /api/comments?page=1&limit=20 */
    getAllComments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract and parse page and limit from query string. Default to 1 and 20.
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await CommentService.getAllComments(page, limit);

            // Set pagination headers (optional but recommended for API discoverability)
            res.header('X-Total-Count', result.meta.totalCount.toString());
            res.header('X-Total-Pages', result.meta.totalPages.toString());
            res.header('X-Current-Page', result.meta.currentPage.toString());
            res.header('X-Page-Limit', result.meta.limit.toString());

            res.status(200).json({
                success: true,
                data: result.comments,
                meta: result.meta,
            });

        } catch (error) {
            next(error);
        }
    },

    /** GET /api/comments/:id */
    getComment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await CommentService.getCommentById(req.params.id);
            res.status(200).json({
                success: true,
                data: comment
            });
        } catch (error) {
            next(error);
        }
    },

    /** PUT /api/comments/:id */
    updateComment: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const commentId = req.params.id;
            const { content } = req.body;

            const updatedComment = await CommentService.updateComment(
                commentId,
                userId,
                { content }
            );

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully.',
                data: updatedComment
            });
        } catch (error) {
            next(error);
        }
    },

    /** DELETE /api/comments/:id */
    deleteComment: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const commentId = req.params.id;

            await CommentService.deleteComment(commentId, userId);

            res.status(204).send({
                success: true,
                message: 'Comment deleted successfully.'
            });
        } catch (error) {
            next(error);
        }
    },
}