import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  DB_URL: string;
  PORT: string;
  NODE_DEV: "development" | "production";
  jwt_secret: string;
  jwt_expires: string;
  bcrypt_salt_round: string;
  super_admin_email: string;
  super_admin_pass: string;
  jwt_refresh_secret: string;
  jwt_refresh_expires: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
}

const loadEnvVariables = (): IEnvVariables => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_DEV",
    "jwt_secret",
    "jwt_expires",
    "bcrypt_salt_round",
    "super_admin_email",
    "super_admin_pass",
    "jwt_refresh_secret",
    "jwt_refresh_expires",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
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
    super_admin_email: process.env.super_admin_email as string,
    super_admin_pass: process.env.super_admin_pass as string,
    jwt_refresh_secret: process.env.jwt_refresh_secret as string,
    jwt_refresh_expires: process.env.jwt_refresh_expires as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};
export const envVars = loadEnvVariables();
