import { Router } from "express";
import { CommentController } from "./comment.controller";

const commentRouter = Router()
commentRouter.post('/', CommentController.createComment)
commentRouter.get('/', CommentController.getAllComments)
commentRouter.put('/:id', CommentController.updateComment)
commentRouter.delete('/:id', CommentController.deleteComment)

export default commentRouter