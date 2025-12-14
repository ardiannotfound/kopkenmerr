import axios from 'axios';
import { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_UPLOAD_PRESET 
} from '../config/cloudinary';

export const uploadToCloudinary = async (
  fileUri: string,
  folderName = "siladan/avatars" // Default folder avatar
) => {
  if (!fileUri) return null;

  const formData = new FormData();
  
  // 1. Ekstrak nama dan tipe file dengan aman
  const fileName = fileUri.split('/').pop() || `upload_${Date.now()}.jpg`;
  
  // Deteksi ekstensi file
  const match = /\.(\w+)$/.exec(fileName);
  const type = match ? `image/${match[1]}` : `image`;

  // 2. Append File (Perhatikan sintaks 'as any' untuk TypeScript di RN)
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: type, // Contoh: 'image/jpeg' atau 'image/png'
  } as any);

  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  if (folderName) {
    formData.append("folder", folderName);
  }

  console.log(`📡 Uploading ${fileName} to Cloudinary...`);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, // Pastikan endpoint 'image/upload'
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data && response.data.secure_url) {
      console.log("✅ Cloudinary Success:", response.data.secure_url);
      return response.data.secure_url;
    } else {
      throw new Error("Cloudinary response missing secure_url");
    }

  } catch (error: any) {
    console.error("❌ Cloudinary Upload Error:", error.response?.data || error.message);
    throw error;
  }
};