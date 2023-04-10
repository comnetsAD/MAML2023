import express from "express";
import path from "path";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logger from "./utils/logger";
import userRouter from "./routes/User";
import { errorMsg, successMsg } from "./utils/messages";

const router = express();

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

  router.use((_, res) => {
    Logger.error(new Error("Endpoint Not Found"));

    res.status(404).json(errorMsg("Endpoint Not Found"));
  });

  const server = router.listen(config.server.port, () => {
    Logger.info(`Server listening on port ${config.server.port}`);
  });

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
