import dotenv from "dotenv";

dotenv.config(
  process.env.NODE_ENV === "prod" ? { path: ".env.prod" } : { path: ".env.dev" }
);

const MONGO_URL = process.env.MONGO_URL || "";

const SERVER_PORT = process.env.SERVER_PORT || 3000;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};
