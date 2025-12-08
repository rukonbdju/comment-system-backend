import { Request, Response, NextFunction } from 'express';
import commentModel from './comment.model';
import CommentService from './comment.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { NotFoundError } from '../../utils/custom-errors';

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
    getAllComments: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                throw new NotFoundError('User not found')
            }
            // Extract and parse page and limit from query string. Default to 1 and 20.
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 2;
            const sort = String(req.query.sort) || 'newest';
            console.log({ page, limit, sort })

            const result = await CommentService.getAllComments(userId, page, limit, sort);


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
            const id = req.params.id;
            const { content } = req.body;

            const updatedComment = await CommentService.updateComment(
                id,
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

            res.status(200).send({
                success: true,
                message: 'Comment deleted successfully.'
            });
        } catch (error) {
            next(error);
        }
    },
}