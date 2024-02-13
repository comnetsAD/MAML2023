import express from "express";
import systemController from "../controllers/System";

const router = express.Router();

router.post("/getMAML", systemController.getMAML);
router.post("/getHTML", systemController.getHTML);

export default router;
