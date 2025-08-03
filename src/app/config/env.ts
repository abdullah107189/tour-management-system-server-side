import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  DB_URL: string;
  PORT: string;
  NODE_DEV: "development" | "production";
}

const loadEnvVariables = (): IEnvVariables => {
  const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_DEV"];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable :------ ${key}`);
    }
  });
  return {
    DB_URL: process.env.DB_URL as string,
    PORT: process.env.PORT as string,
    NODE_DEV: process.env.NODE_DEV as "development" | "production",
  };
};
export const envVars = loadEnvVariables();
