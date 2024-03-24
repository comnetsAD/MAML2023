import { Request, Response } from "express";
import Logger from "../utils/logger";
import { errorMsg } from "../utils/messages";
import User, { IUser } from "../models/User";
import { isGAuthenticated } from "../utils/jwt";

import { exec } from "child_process";
import Page from "../models/Page";

import fs from "fs";
import { randomString } from "../utils/randomString";
import mongoose from "mongoose";

const parent = process.env.NODE_ENV?.trim() === "prod" ? "build" : "src";

const getMAML = async (req: Request, res: Response) => {
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

  const { url } = req.body;

  if (!url) {
    Logger.error("Invalid request");
    res.status(400).json(errorMsg("Invalid request"));
    return;
  }

  exec(
    `${
      process.env.OS_NAME === "win" ? "python" : "python3"
    } ${parent}/system/translate.py ${url}`,
    (err, stdout, stderr) => {
      if (err) {
        Logger.error(err);
        res.status(500).json(errorMsg("Internal server error"));
        return;
      }

      res.status(200).json({ success: true, data: stdout });
    }
  );
};

const getHTML = async (req: Request, res: Response) => {
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

  const { url } = req.body;

  if (!url) {
    Logger.error("Invalid request");
    res.status(400).json(errorMsg("Invalid request"));
    return;
  }

  const page = await Page.findOne({
    url: url,
    userID: new mongoose.Types.ObjectId(user._id)
  });

  if (!page) {
    Logger.error("Page not found");
    res
      .status(404)
      .json(errorMsg("Page not found. Please save the page first."));
    return;
  }

  const maml = page.mamlFileContent;
  const fileName = `${randomString()}.maml`;

  if (!fs.existsSync(`${parent}/system/temp`)) {
    fs.mkdirSync(`${parent}/system/temp`, { recursive: true });
  }

  if (!fs.existsSync("public/html")) {
    fs.mkdirSync("public/html", { recursive: true });
  }

  fs.writeFileSync(`${parent}/system/temp/` + fileName, maml);

  exec(
    `${
      process.env.OS_NAME === "win" ? "python" : "python3"
    } ${parent}/system/generateHTML.py temp/` + fileName,
    (err, stdout, stderr) => {
      if (err) {
        Logger.error(err);
        res.status(500).json(errorMsg("Internal server error"));
        return;
      }

      fs.unlinkSync(`${parent}/system/temp/` + fileName);

      const htmlFileName = fileName.replace(".maml", ".html");
      // fs.writeFileSync("public/html/" + htmlFileName, stdout);

      res.status(200).json({
        success: true,
        html: process.env.WEBSITE_URL + "public/html/" + htmlFileName
      });
    }
  );
};

export default { getMAML, getHTML };
