import express from "express";
import userController from "../controllers/User";

const router = express.Router();

router.post("/login", userController.login);

export default router;
