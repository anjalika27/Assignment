import express from "express";
import { registerUser, verifyUserEmailUsingOtp ,addMoreDetails,loginUser, userDetails } from "../controllers/controller.js";
import { jwtAuthMiddleware } from "../services/jwt.js";

const router=express.Router();

router.post('/register', registerUser);
router.post('/verify',verifyUserEmailUsingOtp);
router.post('/add-more-details',addMoreDetails);
router.post('/login',loginUser);
router.get('/user-details',jwtAuthMiddleware,userDetails);


export default router;