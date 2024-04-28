
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_APIKEY, 
    api_secret: process.env.CLOUD_APISECRET
  });


// upload image file in cloud 
const cloudinaryFileUploder = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        } else {
            const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
            return { image_url: response.url, publicId: response.public_id };
        }
    } catch (err) {
        fs.unlinkSync(localFilePath);
console.log('cloudinary error', err);
        return null;
    }
};

const uplodeImagesCloudinary = async (filePath) => {
    console.log("filePath ", filePath);
    if (filePath) {
        const image = await cloudinary.uploader.upload(filePath)
        if (image) {
            fs.unlinkSync(filePath)
            return image
        } else {
            fs.unlinkSync(filePath)
            return null;
        }
    } else {
        return null;
    }

}


// remove the user cloud image file 
const removeCloudinaryImage = async (publicId) => {
    const imageStatus = await cloudinary.uploader.destroy(publicId)

    return imageStatus
}


module.exports = { cloudinaryFileUploder, removeCloudinaryImage, uplodeImagesCloudinary }