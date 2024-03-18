import express from "express";
import path from "path";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logger from "./utils/logger";
import userRouter from "./routes/User";
import pageRouter from "./routes/Page";
import systemRouter from "./routes/System";
import uploadRouter from "./routes/Upload";
import { errorMsg, successMsg } from "./utils/messages";
import https from "https";
import http from "http";
import fs from "fs";

const router = express();
const options: https.ServerOptions = {
  key: fs.readFileSync("certificate/key.key"),
  cert: fs.readFileSync("certificate/cert.cer")
};

mongoose
  .connect(config.mongo.url, { authMechanism: "DEFAULT" })
  .then(() => {
    Logger.info("Connected to MongoDB");
    main();
  })
  .catch((err) => {
    Logger.error(err);
  });

const main = () => {
  router.use((req, _, next) => {
    Logger.info(
      `${req.method} REQUEST: ${req.url} ${req.ip || req.socket.remoteAddress}`
    );

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    next();
  });

  router.get("/", (_, res) => {
    res.status(200).json(successMsg("backend service is up and running"));
  });

  router.get("/health", (_, res) => {
    res.status(200).json(successMsg("Server is healthy"));
  });

  router.use("/public", express.static(path.join(__dirname, "../public")));

  /* Routes */
  router.use("/users", userRouter);
  router.use("/pages", pageRouter);
  router.use("/system/", systemRouter);
  router.use("/upload", uploadRouter);

  router.use((_, res) => {
    Logger.error(new Error("Endpoint Not Found"));

    res.status(404).json(errorMsg("Endpoint Not Found"));
  });

  let server: https.Server | http.Server;

  if (process.env.NODE_ENV?.trim() === "prod") {
    server = https
      .createServer(options, router)
      .listen(config.server.port, () => {
        Logger.info(`Server listening on port ${config.server.port}`);
      });
  } else {
    server = http.createServer(router).listen(config.server.port, () => {
      Logger.info(`Server listening on port ${config.server.port}`);
    });
  }

  process.on("SIGTERM", () => {
    console.info("SIGTERM received.");

    server.close(() => {
      console.log("SERVER closed.");

      mongoose.connection.close(false).then(() => {
        console.log("MongoDB closed.");
        process.exit(0);
      });
    });
  });
};
