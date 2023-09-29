// pages/api/upload.js

import cloudinary from "cloudinary";

import formidable from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Initialize Cloudinary with your credentials
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Upload files to Cloudinary
      const uploadedFiles = Object.values(files);

      console.log(uploadedFiles);

      const uploadResults = await Promise.all(
        uploadedFiles.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url; // Extracting the secure URL of the uploaded image
        })
      );

      res.status(200).json({ uploadedImages: uploadResults });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
