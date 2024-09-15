import express from "express";
import { asyncHandler } from "../utils/WrapAsync.js";
import { loginUser, signupUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(asyncHandler(signupUser));
router.route("/login").post(asyncHandler(loginUser));

export default router;
