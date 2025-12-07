import mongoose from "mongoose";
import commentModel from "./comment.model";
import { populate } from "dotenv";

const CommentRepository = {
    /** Creates a new comment. */
    create: async (data: { content: string; user: string; }) => {
        const newComment = new commentModel({
            content: data.content,
            user: new mongoose.Types.ObjectId(data.user)
        })
        return (await newComment.save()).populate('user')
    },

    /** Finds a comment by ID and populates the user field. */
    findById: async (id: string) => {
        return commentModel.findById(id).populate('user').lean();
    },

    /** Finds all comments with pagination and returns total count. */
    findAll: async (page: number = 1, limit: number = 20) => {
        const skip = (page - 1) * limit;

        // Fetch comments
        const comments = await commentModel.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user')
            .lean();

        // Fetch total count (without filtering)
        const totalCount = await commentModel.countDocuments({});

        return { comments, totalCount };
    },

    /** Updates a comment's content. */
    update: async (id: string, data: { content: string; }) => {
        const updatedComment = await commentModel.findByIdAndUpdate(
            id,
            {
                $set: { content: data.content, updatedAt: new Date() }
            },
            { new: true, runValidators: true } // Return the new document
        )
            .populate('user')
            .lean();

        return updatedComment;
    },

    /** Deletes a comment by ID. */
    delete: async (id: string): Promise<boolean> => {
        const result = await commentModel.findByIdAndDelete(id);
        return !!result; // Return true if document was found and deleted
    },

    /** Atomically increments/decrements like or dislike count. */
    updateCount: async (id: string, action: 'like' | 'dislike', increment: 1 | -1) => {
        const updateField = action === 'like' ? 'likeCount' : 'dislikeCount';

        const updatedComment = await commentModel.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: increment } },
            { new: true }
        )
            .populate('user')
            .lean();

        return updatedComment;
    }
}

export default CommentRepository;