/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";
let server: Server;

const startServer = async () => {
  try {
    const url = envVars.DB_URL;
    if (!url) {
      throw new Error("Database URL is not defined in environment variables.");
    }
    await mongoose.connect(url as string);
    console.log("connected server");
    server = app.listen(envVars.PORT, () => {
      console.log(`server is listening on the port : ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

// when promise rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// when local error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shuting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// when could main owner singer throw for shout down server signal, and it's not error !
process.on("SIGTERM", () => {
  console.log("Sigterm received... Server shuting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject("promise error .........")
// throw new Error("local error ...........");
