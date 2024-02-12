import express from "express";
import pageController from "../controllers/Page";

const router = express.Router();

router.post("/save", pageController.save);

export default router;
