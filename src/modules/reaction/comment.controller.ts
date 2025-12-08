import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ConflictError } from '../../utils/custom-errors';
import { ReactionService } from './reaction.service';

export const ReactionController = {
    handleCommentLike: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const targetId = req.body.targetId;
            const data = {
                userId,
                targetId,
                targetType: 'Comment',
                reactionType: 'like'
            }

            const result = await ReactionService.handleReaction(data);

            let statusCode = 200;

            res.status(statusCode).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    },
    handleCommentDislike: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const targetId = req.body.targetId;
            const data = {
                userId,
                targetId,
                targetType: 'Comment',
                reactionType: 'dislike'
            }

            const result = await ReactionService.handleReaction(data);

            let statusCode = 200;

            res.status(statusCode).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    },
}