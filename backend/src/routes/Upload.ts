import express, { Request, Response } from "express";
import multer from "multer";
import uploadController from "../controllers/Upload";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/image",
  upload.single("file"),
  uploadController.uploadImage
);

export default router;
