import { Request, Response } from "express";
import { errorMsg } from "../utils/messages";
import { isGAuthenticated } from "../utils/jwt";
import { clearTempFile, processImage } from "../utils/processImage";
import Logger from "../utils/logger";

const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    Logger.error("No file uploaded");
    res.status(400).json(errorMsg("No file uploaded"));
    return;
  }

  const file = req.file;

  const authorized = isGAuthenticated(req);

  if (!authorized) {
    Logger.error("Unauthorized");
    clearTempFile(file.path);
    
    res.status(401).json(errorMsg("Unauthorized"));
    return;
  }

  if (!file || !["image/jpeg", "image/png"].includes(file.mimetype)) {
    res.status(400).json(errorMsg("Invalid file type, Should be JPG or PNG."));
    return;
  }

  const [imageUrl, thumbnailUrl] = await processImage(file);

  res.status(200).json({ success: true, imageUrl, thumbnailUrl });
};

export default { uploadImage };
