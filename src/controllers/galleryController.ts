import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import {
  fetchAllGalleryItems,
  fetchGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../services/galleryService';

// @desc    Get all university memorable photos
// @route   GET /api/gallery (or /api/education/gallery)
// @access  Public
export const getGallery = catchAsync(async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const institution = req.query.institution as string | undefined;

  const result = await fetchAllGalleryItems(category, institution);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    count: result.count,
    data: result.data,
  });
});

// @desc    Get single university memorable photo by ID
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryById = catchAsync(async (req: Request, res: Response) => {
  const item = await fetchGalleryItemById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: item,
  });
});

// @desc    Create new university memorable photo
// @route   POST /api/gallery
// @access  Private / Admin
export const createGallery = catchAsync(async (req: Request, res: Response) => {
  const newItem = await createGalleryItem(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'University memorable photo created successfully',
    data: newItem,
  });
});

// @desc    Update existing university memorable photo
// @route   PUT /api/gallery/:id
// @access  Private / Admin
export const updateGallery = catchAsync(async (req: Request, res: Response) => {
  const updatedItem = await updateGalleryItem(req.params.id, req.body, req.file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'University memorable photo updated successfully',
    data: updatedItem,
  });
});

// @desc    Delete university memorable photo
// @route   DELETE /api/gallery/:id
// @access  Private / Admin
export const deleteGallery = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteGalleryItem(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { id: result.deletedId },
  });
});
