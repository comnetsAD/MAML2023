import crypto from "crypto";

export const randomString = (): string => {
  return crypto.randomBytes(12).toString("hex");
};
