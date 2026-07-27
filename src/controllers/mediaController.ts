import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary';
import prisma from '../config/prisma';

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided for upload');
  }

  const { path: url, filename: publicId, size } = req.file;
  const assetType = req.body.assetType || 'general';

  let savedAsset: any = null;
  try {
    savedAsset = await prisma.mediaAsset.create({
      data: {
        url,
        publicId,
        assetType,
        size,
      },
    });
  } catch (error) {
    savedAsset = { url, publicId, assetType, size };
  }

  res.status(201).json({
    success: true,
    message: 'Photo uploaded successfully to Cloudinary',
    data: savedAsset,
  });
});

export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const publicId = req.params.publicId || (req.params as any)[0] || (req.query.publicId as string);

  if (!publicId) {
    res.status(400);
    throw new Error('publicId parameter is required for media deletion');
  }

  const decodedPublicId = decodeURIComponent(publicId);

  const result = await cloudinary.uploader.destroy(decodedPublicId);

  try {
    await prisma.mediaAsset.delete({ where: { publicId: decodedPublicId } });
  } catch (error) {
    // Ignore if not in DB
  }

  res.status(200).json({
    success: true,
    message: 'Photo deleted successfully from Cloudinary',
    cloudinaryResult: result,
  });
});
