import crypto from "crypto";

export const randomString = (): string => {
  return crypto.randomBytes(50).toString("hex");
};
