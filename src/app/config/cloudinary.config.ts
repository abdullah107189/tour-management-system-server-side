import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
cloudinary.config({
  cloud_name: envVars.cloudinary_cloud_name,
  api_key: envVars.cloudinary_cloud_api_key,
  api_secret: envVars.cloudinary_cloud_api_secret,
});

export const deleteImagesFromCloudinary = async (url: string) => {
  try {
    const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};
export const cloudinaryUpload = cloudinary;
