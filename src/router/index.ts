import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import { protect } from "../middlewares/auth.middleware";
import commentRouter from "../modules/comment/comment.routes";

const router = Router()
router.use('/auth', authRouter)
router.use('/comments', protect, commentRouter)

export default router;