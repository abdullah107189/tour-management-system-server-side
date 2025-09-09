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
  SSL: {
    // ssl commerz
    SSL_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_APY: string;
    SSL_VALIDATION_API: string;

    // ssl backend
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAIL_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;

    // ssl frontend
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAIL_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;
  };
  // cloudinary
  cloudinary_cloud_name: string;
  cloudinary_cloud_api_key: string;
  cloudinary_cloud_api_secret: string;
  // RADIS
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
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
    "SSL_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_APY",
    "SSL_VALIDATION_API",
    // backend
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    // frontend
    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
    // cloudinary
    "cloudinary_cloud_name",
    "cloudinary_cloud_api_key",
    "cloudinary_cloud_api_secret",
    // redis
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "REDIS_HOST",
    "REDIS_PORT",
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
    SSL: {
      SSL_ID: process.env.SSL_ID as string,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_APY: process.env.SSL_PAYMENT_APY as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      // backend
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
      // frontend
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    },
    // cloudinary
    cloudinary_cloud_name: process.env.cloudinary_cloud_name as string,
    cloudinary_cloud_api_key: process.env.cloudinary_cloud_api_key as string,
    cloudinary_cloud_api_secret: process.env
      .cloudinary_cloud_api_secret as string,

    // redis
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
  };
};
export const envVars = loadEnvVariables();
