import express from "express";
import pageController from "../controllers/Page";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.post("/save", upload.single("mamlFileContent"), pageController.save);

export default router;
