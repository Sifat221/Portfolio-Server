import prisma from '../config/prisma';
import { cloudinary } from '../config/cloudinary';
import { UpdateMediaInput } from '../types';
import ApiError from '../errors/ApiError';

// ==================== CREATE / UPLOAD ====================

// Upload single media asset
export const uploadMediaAsset = async (file?: Express.Multer.File, assetType: string = 'general') => {
  if (!file) {
    throw new ApiError(400, 'No image or video file provided for upload');
  }

  const { path: url, filename: publicId, size, originalname } = file;

  let savedAsset: any = null;
  try {
    savedAsset = await prisma.mediaAsset.create({
      data: {
        url,
        publicId,
        assetType,
        filename: originalname || publicId,
        size,
      },
    });
  } catch (error) {
    savedAsset = { url, publicId, assetType, filename: originalname || publicId, size };
  }

  return savedAsset;
};

// Upload multiple media assets (e.g. for achievements, certificates, project galleries)
export const uploadMultipleMediaAssets = async (files?: Express.Multer.File[], assetType: string = 'general') => {
  if (!files || files.length === 0) {
    throw new ApiError(400, 'No media files provided for bulk upload');
  }

  const savedAssets: any[] = [];

  for (const file of files) {
    const { path: url, filename: publicId, size, originalname } = file;
    try {
      const asset = await prisma.mediaAsset.create({
        data: {
          url,
          publicId,
          assetType,
          filename: originalname || publicId,
          size,
        },
      });
      savedAssets.push(asset);
    } catch (error) {
      savedAssets.push({ url, publicId, assetType, filename: originalname || publicId, size });
    }
  }

  return savedAssets;
};

// ==================== READ / FETCH ====================

// Get all media assets (with optional assetType filter: achievement, certificate, project, etc.)
export const getAllMediaAssets = async (assetType?: string) => {
  try {
    const whereCondition = assetType ? { assetType } : {};
    const mediaList = await prisma.mediaAsset.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
    return { count: mediaList.length, data: mediaList };
  } catch (error) {
    return { count: 0, data: [] };
  }
};

// Get single media asset by ID or publicId
export const getMediaAssetById = async (idOrPublicId: string) => {
  const decoded = decodeURIComponent(idOrPublicId);
  try {
    let asset = await prisma.mediaAsset.findUnique({ where: { id: decoded } });
    if (!asset) {
      asset = await prisma.mediaAsset.findUnique({ where: { publicId: decoded } });
    }

    if (asset) {
      return asset;
    }
  } catch (error) {
    // Ignore and proceed to 404 error
  }

  throw new ApiError(404, `Media asset not found with ID or publicId: ${decoded}`);
};

// ==================== UPDATE ====================

// Update media asset metadata (assetType, filename) and/or replace image on Cloudinary CDN
export const updateMediaAsset = async (
  idOrPublicId: string,
  updateData: UpdateMediaInput,
  file?: Express.Multer.File
) => {
  const existingAsset = await getMediaAssetById(idOrPublicId);

  let newUrl = existingAsset.url;
  let newPublicId = existingAsset.publicId;
  let newSize = existingAsset.size;

  if (file) {
    if (existingAsset.publicId) {
      try {
        await cloudinary.uploader.destroy(existingAsset.publicId);
      } catch (cloudinaryErr) {
        console.warn('[Cloudinary Purge Warning]:', cloudinaryErr);
      }
    }
    newUrl = (file as any).path;
    newPublicId = (file as any).filename;
    newSize = file.size;
  }

  try {
    const updated = await prisma.mediaAsset.update({
      where: { id: existingAsset.id },
      data: {
        assetType: updateData.assetType || existingAsset.assetType,
        filename: updateData.filename || file?.originalname || existingAsset.filename,
        url: newUrl,
        publicId: newPublicId,
        size: newSize,
      },
    });
    return updated;
  } catch (error: any) {
    throw new ApiError(500, `Failed to update media asset: ${error.message}`);
  }
};

// ==================== DELETE ====================

// Delete single media asset from Cloudinary CDN and Prisma DB
export const deleteMediaAsset = async (publicIdParam?: string) => {
  if (!publicIdParam) {
    throw new ApiError(400, 'publicId parameter is required for media deletion');
  }

  const decodedPublicId = decodeURIComponent(publicIdParam);

  const result = await cloudinary.uploader.destroy(decodedPublicId);

  try {
    await prisma.mediaAsset.delete({ where: { publicId: decodedPublicId } });
  } catch (error) {
    try {
      await prisma.mediaAsset.delete({ where: { id: decodedPublicId } });
    } catch (err2) {
      // Ignore if not in DB
    }
  }

  return { cloudinaryResult: result };
};

// Delete multiple media assets from Cloudinary CDN and Prisma DB in bulk
export const deleteMultipleMediaAssets = async (publicIds: string[]) => {
  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    throw new ApiError(400, 'An array of publicIds is required for bulk deletion');
  }

  const deletionResults: any[] = [];

  for (const rawPublicId of publicIds) {
    const decoded = decodeURIComponent(rawPublicId);
    try {
      const result = await cloudinary.uploader.destroy(decoded);
      await prisma.mediaAsset.deleteMany({
        where: {
          OR: [{ publicId: decoded }, { id: decoded }],
        },
      });
      deletionResults.push({ publicId: decoded, status: 'deleted', result });
    } catch (err: any) {
      deletionResults.push({ publicId: decoded, status: 'error', error: err.message });
    }
  }

  return deletionResults;
};
