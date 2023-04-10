import { Request } from "express";
import jwt from "jsonwebtoken";

export const createJWT = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
    
  } catch (err) {
    return false;
  }
};

export const decodeJWT = (token: string): { email: string } => {
  return (jwt.decode(token) as { email: string }) || { email: "" };
};

export const isGAuthenticated = (req: Request): {email: string} | null => {
  const headers = req.headers;
  if (headers.authorization) {
    const token = headers.authorization.split(" ")[1];
    return verifyJWT(token) as {email: string};
  }

  return null;
};
