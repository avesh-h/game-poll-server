const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// STEPS
//1) when user will upload the profile image we get that image into the our local fs or our server and then upload it onto the cloudinary
//2) after the succssful upload of file into cloudinary we remove that image from our server or our local

module.exports = async function uploadFileOnCloudinary(filePath) {
  try {
    if (!filePath) {
      //File not found!
      return null;
    }
    // Upload an image function
    const uploadResult = await cloudinary.uploader.upload(filePath);

    return uploadResult;

    //Generated URL will be store in the DB
    // const url = cloudinary.url(uploadResult?.public_id, {
    //   //Extra option for in which format or which size and quality of image you want to store
    //   transformation: [
    //     { quality: "auto", fetch_format: "auto" },
    //     { crop: "auto", gravity: "auto" },
    //     //   { width: 165, height: 165 },
    //   ],
    // });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    //   const optimizeUrl = cloudinary.url("shoes", {
    //     fetch_format: "auto",
    //     quality: "auto",
    //   });

    //   console.log(optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    //Generate URL of your image
    //   const autoCropUrl = cloudinary.url("Acer_Wallpaper_03_3840x2400_h5hzqu", {
    //     crop: "auto",
    //     gravity: "auto",
    //     width: 165,
    //     height: 165,
    //   });

    //   console.log(autoCropUrl);
  } catch (error) {
    console.log("ERROR::::", error);
    //We need to remove file in the upload of the image fail because we don't want to keep that file into our server
    fs.unlinkSync(filePath);
    return null;
  }
};
