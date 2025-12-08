import { Router } from "express";
import { ReactionController } from "./comment.controller";

const reactionRouter = Router()
reactionRouter.post('/comment/like', ReactionController.handleCommentLike)
reactionRouter.post('/comment/dislike', ReactionController.handleCommentDislike)

export default reactionRouter