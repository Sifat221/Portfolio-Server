import { upload } from '../config/cloudinary';

export const uploadSinglePhoto = upload.single('photo');
export const uploadMultiplePhotos = upload.array('photos', 10);
