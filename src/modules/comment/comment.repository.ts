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
    findAll: async (page: number = 1, limit: number = 20, sort: string = "newest") => {
        try {
            const skip = (page - 1) * limit;

            const SORT_MAP: Record<string, any> = {
                newest: { createdAt: -1 },
                oldest: { createdAt: 1 },
                "most liked": { likeCount: -1 },
                "most disliked": { dislikeCount: -1 },
            };

            const sortOrder = SORT_MAP[sort.toLowerCase()] || SORT_MAP.newest;

            const [comments, totalCount] = await Promise.all([
                commentModel
                    .find()
                    .sort(sortOrder)
                    .skip(skip)
                    .limit(limit)
                    .populate("user")
                    .lean(),

                commentModel.countDocuments(),
            ]);

            return { comments, totalCount };
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw new Error("Failed to fetch comments");
        }
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
        return result ? true : false; // Return true if document was found and deleted
    },

    /** Atomically increments/decrements like or dislike count. */
    updateCount: async (id: string, action: string, increment: 1 | -1) => {
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