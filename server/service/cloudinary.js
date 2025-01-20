require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const secret = process.env.JWT_SECRET;

const getUrlImage = async (imagePath) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(imagePath, {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      resource_type: "auto", // Automatically detects the file type
    });

    // Return the secure URL of the uploaded image
    return uploadedImage.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

module.exports = { getUrlImage };
