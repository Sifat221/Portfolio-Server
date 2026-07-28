import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import {
  uploadMediaAsset,
  uploadMultipleMediaAssets,
  getAllMediaAssets,
  getMediaAssetById,
  updateMediaAsset,
  deleteMediaAsset,
  deleteMultipleMediaAssets,
} from '../services/mediaService';

// @desc    Upload a single media file (photo/video)
// @route   POST /api/media/upload
// @access  Private / Admin
export const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  const savedAsset = await uploadMediaAsset(req.file, req.body.assetType);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Media uploaded successfully to Cloudinary',
    data: savedAsset,
  });
});

// @desc    Upload multiple media files in bulk (photos/videos for achievements, certificates, etc.)
// @route   POST /api/media/upload-multiple
// @access  Private / Admin
export const uploadMultipleMedia = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const savedAssets = await uploadMultipleMediaAssets(files, req.body.assetType);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${savedAssets.length} media files uploaded successfully to Cloudinary`,
    count: savedAssets.length,
    data: savedAssets,
  });
});

// @desc    Get all uploaded media assets (optional filter: ?assetType=achievement)
// @route   GET /api/media
// @access  Public
export const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const assetType = req.query.assetType as string | undefined;
  const result = await getAllMediaAssets(assetType);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    count: result.count,
    data: result.data,
  });
});

// @desc    Get single media asset by ID or publicId
// @route   GET /api/media/:id
// @access  Public
export const getMediaById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const asset = await getMediaAssetById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: asset,
  });
});

// @desc    Update media asset metadata or replace photo/video asset
// @route   PUT /api/media/:id
// @access  Private / Admin
export const updateMedia = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedAsset = await updateMediaAsset(id, req.body, req.file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Media asset updated successfully',
    data: updatedAsset,
  });
});

// @desc    Delete single media asset from Cloudinary & DB
// @route   DELETE /api/media/:publicId
// @access  Private / Admin
export const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const publicId = req.params.publicId || (req.params as any)[0] || (req.query.publicId as string);
  const result = await deleteMediaAsset(publicId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Media asset deleted successfully from Cloudinary',
    cloudinaryResult: result.cloudinaryResult,
  });
});

// @desc    Delete multiple media assets in bulk
// @route   POST /api/media/delete-multiple
// @access  Private / Admin
export const deleteMultipleMedia = catchAsync(async (req: Request, res: Response) => {
  const publicIds = req.body.publicIds;
  const results = await deleteMultipleMediaAssets(publicIds);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bulk media deletion processed',
    count: results.length,
    data: results,
  });
});
