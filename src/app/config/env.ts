import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  DB_URL: string;
  PORT: string;
  NODE_DEV: "development" | "production";
  jwt_secret: string;
  jwt_expires: string;
  bcrypt_salt_round: string;
}

const loadEnvVariables = (): IEnvVariables => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_DEV",
    "jwt_secret",
    "jwt_expires",
    "bcrypt_salt_round",
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable :------ ${key}`);
    }
  });
  return {
    DB_URL: process.env.DB_URL as string,
    PORT: process.env.PORT as string,
    NODE_DEV: process.env.NODE_DEV as "development" | "production",
    jwt_expires: process.env.jwt_expires as string,
    jwt_secret: process.env.jwt_secret as string,
    bcrypt_salt_round: process.env.bcrypt_salt_round as string,
  };
};
export const envVars = loadEnvVariables();
