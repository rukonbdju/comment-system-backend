import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const authRouter = Router()
authRouter.post('/register', AuthController.register)
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/refresh', AuthController.refresh);
//protected
authRouter.get('/me', protect, AuthController.getProfile)

export default authRouter;