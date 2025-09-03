import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
cloudinary.config({
  cloud_name: envVars.cloudinary_cloud_name,
  api_key: envVars.cloudinary_cloud_api_key,
  api_secret: envVars.cloudinary_cloud_api_secret,
});

export const cloudinaryUpload = cloudinary;
