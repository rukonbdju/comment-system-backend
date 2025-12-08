
import mongoose from 'mongoose';

export interface CreateReactionDTO {
    userId: string;
    targetType: string;
    targetId: string;
    reactionType: string;
}

import reactionModel from './reaction.model';

export const ReactionRepository = {
    /** Finds a user's existing reaction on a specific target. */
    findByUserAndTarget: async (userId: string, targetId: string) => {
        return reactionModel.findOne({
            user: userId,
            targetId,
        }).lean();
    },
    findUserReactionsByTargetIds: async (userId: string, targetIds: (mongoose.Types.ObjectId | string)[]):
        Promise<Map<string, 'like' | 'dislike'>> => {

        const reactions = await reactionModel.find({
            user: userId,
            targetType: 'Comment',
            targetId: { $in: targetIds }
        }).select('targetId reactionType').lean();

        const reactionMap = new Map<string, 'like' | 'dislike'>();
        reactions.forEach(reaction => {
            reactionMap.set(reaction.targetId.toString(), reaction.reactionType);
        });

        return reactionMap;
    },

    /** Creates a new reaction. */
    create: async (data: CreateReactionDTO) => {
        const newReaction = new reactionModel({
            user: data.userId,
            targetType: data.targetType,
            targetId: data.targetId,
            reactionType: data.reactionType,
        });
        return newReaction.save();
    },

}