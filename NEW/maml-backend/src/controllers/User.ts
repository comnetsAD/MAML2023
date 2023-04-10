import { Request, Response } from "express";
import Logger from "../utils/logger";
import { errorMsg } from "../utils/messages";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import User from "../models/User";
import { createJWT } from "../utils/jwt";

const client = new OAuth2Client(process.env.GAUTH_CLIENT_ID);

const login = async (req: Request, res: Response) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400).json(errorMsg("Credential not provided"));
    return;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GAUTH_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const user = await User.exists({ email: payload?.email });

    if (!user) {
      const newUser = new User({
        name: payload?.name,
        email: payload?.email,
        picture: payload?.picture
      });

      try {
        await newUser.save();
        Logger.info(`User ${newUser.email} created`);
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    }

    const jwt = createJWT(payload?.email || "");

    res.status(200).json({ success: true, message: "Login success", jwt });
  } catch (err) {
    Logger.error(err);
    res.status(401).json(errorMsg("Token verification failed."));
  }
};

export default { login };
