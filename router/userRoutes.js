import express from "express";
import { registerUser, verifyUserEmailUsingOtp ,addMoreDetails } from "../controllers/controller.js";

const router=express.Router();

router.post('/register', registerUser);
router.post('/verify',verifyUserEmailUsingOtp);
router.post('/add-more-details',addMoreDetails);


export default router;