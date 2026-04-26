import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "forever-ecommerce/products",
    });

    fs.unlinkSync(localFilePath);
    return result.url;
  } catch (error) {
    console.log(
      "error occurred while uploading image to cloudinary",
      error.message,
    );
    fs.unlinkSync(localFilePath);
    return null;
  }
};
