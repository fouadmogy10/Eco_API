const cloudinary = require('cloudinary');
// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_Cloud_Name,
    api_key: process.env.CLOUDNARY_API_Key,
    api_secret: process.env.CLOUDNARY_API_Secret
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(fileToUploads, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  
  const CloudRemoveMultiImage = async (publicId) => {
      try {
          const data = await cloudinary.v2.api.delete_resources(publicId);
          return data
      } catch (error) {
          throw new Error("internal server Error (Cloudinary)")
      }
  }
  module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };

