import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const uploadCloudinary = async (localPath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!localPath) return null;

  try {
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    //console.log("Cloudinary image successfully uploaded", response);

    // cleanup temp file after success
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return response;
  } catch (error) {
 //   console.error("Cloudinary upload failed:", error);
 fs.unlinkSync(localPath)
    return null;
  }
};

export { uploadCloudinary };