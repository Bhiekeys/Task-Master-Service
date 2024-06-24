import { Router } from "express";
import AuthController from "./controllers/auth.controller";

const router: Router = Router();

// auth endpoints
router.post('/auth/sign-up', AuthController.userSignUp);

router.get('/auth/verify-user', AuthController.verifyUser);

router.post('/auth/login', AuthController.login);

router.put('/auth/forgot-password', AuthController.forgotPassword);

router.post('/auth/verify-otp/:email', AuthController.verifyOtp);

router.put('/auth/reset-password/:email/:otpId', AuthController.resetPassword);

export default router;