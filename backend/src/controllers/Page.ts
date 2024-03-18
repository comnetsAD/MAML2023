import { Request, Response } from "express";
import Logger from "../utils/logger";
import { errorMsg, successMsg } from "../utils/messages";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import User, { IUser } from "../models/User";
import Page from "../models/Page";
import { isGAuthenticated } from "../utils/jwt";

const save = async (req: Request, res: Response) => {
  const authorized = isGAuthenticated(req);

  if (!authorized) {
    Logger.error("Unauthorized save requested.");
    res.status(401).json(errorMsg("Unauthorized"));
    return;
  }

  const user = await User.findOne<IUser>({ email: authorized.email });

  if (!user) {
    res.status(401).json(errorMsg("Unauthorized"));
    return;
  }

  const { url, translateDuration } = req.body;
  const mamlFileContent = req.file?.buffer.toString("utf8");

  if (!url || !mamlFileContent) {
    Logger.error("Invalid request");
    res.status(400).json(errorMsg("You can't save an empty document."));
    return;
  }

  const existingPage = await Page.findOne({
    userID: user._id,
    url
  });

  if (existingPage) {
    await existingPage.updateOne({ $set: { mamlFileContent, translateDuration } });

    Logger.error("Page already exists");
    res
      .status(200)
      .json(
        successMsg(
          "You have already submitted this page. New submission was overridden. You may now close/reload the MAML Editor."
        )
      );
    return;
  }

  const page = new Page({
    userID: user._id,
    url,
    mamlFileContent,
    translateDuration
  });

  try {
    await page.save();
    res.status(200).json({ success: true, message: "Page saved" });
  } catch (err) {
    Logger.error(err);
    res.status(500).json(err);
  }
};

export default { save };
