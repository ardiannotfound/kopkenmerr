// src/services/storageService.ts
import axios from 'axios';
import { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_UPLOAD_PRESET 
} from '../config/cloudinary';

export const uploadToCloudinary = async (
  fileUri: string,
  folderName = "siladan/general"
) => {
  if (!fileUri) return null;

  // 1. Siapkan FormData
  const formData = new FormData();
  
  // React Native butuh object { uri, name, type } untuk file upload
  const fileName = fileUri.split('/').pop();
  const fileType = fileName?.split('.').pop(); // jpg, png

  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
  } as any); // Type assertion 'as any' kadang diperlukan di RN untuk FormData

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  if (folderName) {
    formData.append("folder", folderName);
  }

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error", error);
    throw error;
  }
};