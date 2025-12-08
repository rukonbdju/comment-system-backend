import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import { protect } from "../middlewares/auth.middleware";
import commentRouter from "../modules/comment/comment.routes";
import reactionRouter from "../modules/reaction/reaction.routes";

const router = Router()
router.use('/auth', authRouter)
router.use('/comments', protect, commentRouter)
router.use('/reactions', protect, reactionRouter)
export default router;