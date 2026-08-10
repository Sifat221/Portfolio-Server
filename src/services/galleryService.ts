import prisma from '../config/prisma';
import { cloudinary } from '../config/cloudinary';
import { CreateUniversityGalleryInput, UpdateUniversityGalleryInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllGalleryItems = async (category?: string, institution?: string) => {
  try {
    const where: any = {};
    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (institution) where.institution = { contains: institution, mode: 'insensitive' };

    const items = await prisma.universityGallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { count: items.length, data: items, isFallback: false };
  } catch (error) {
    console.warn('Prisma UniversityGallery fetch error:', error);
    return { count: 0, data: [], isFallback: true };
  }
};

export const fetchGalleryItemById = async (id: string) => {
  const item = await prisma.universityGallery.findUnique({
    where: { id },
  });

  if (!item) {
    throw new ApiError(404, `University gallery photo with ID '${id}' not found`);
  }

  return item;
};

export const createGalleryItem = async (
  input: CreateUniversityGalleryInput,
  file?: Express.Multer.File
) => {
  let imageUrl = input.imageUrl;
  let cloudinaryPublicId = input.cloudinaryPublicId;

  if (file) {
    imageUrl = file.path || (file as any).secure_url;
    cloudinaryPublicId = (file as any).filename || (file as any).public_id;
  }

  if (!imageUrl) {
    throw new ApiError(400, 'Image URL or uploaded image file is required');
  }

  const newItem = await prisma.universityGallery.create({
    data: {
      title: input.title || 'University Memorable Moment',
      description: input.description || null,
      imageUrl,
      cloudinaryPublicId: cloudinaryPublicId || null,
      institution: input.institution || 'Daffodil International University',
      category: input.category || 'Memories',
      date: input.date || null,
    },
  });

  return newItem;
};

export const updateGalleryItem = async (
  id: string,
  input: UpdateUniversityGalleryInput,
  file?: Express.Multer.File
) => {
  const existing = await prisma.universityGallery.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, `University gallery photo with ID '${id}' not found`);
  }

  let imageUrl = input.imageUrl || existing.imageUrl;
  let cloudinaryPublicId = input.cloudinaryPublicId || existing.cloudinaryPublicId;

  if (file) {
    imageUrl = file.path || (file as any).secure_url;
    cloudinaryPublicId = (file as any).filename || (file as any).public_id;

    // Delete old Cloudinary asset if replaced
    if (existing.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      } catch (err) {
        console.warn('Failed to delete previous Cloudinary image:', err);
      }
    }
  }

  const updatedItem = await prisma.universityGallery.update({
    where: { id },
    data: {
      title: input.title !== undefined ? input.title : existing.title,
      description: input.description !== undefined ? input.description : existing.description,
      imageUrl,
      cloudinaryPublicId,
      institution: input.institution !== undefined ? input.institution : existing.institution,
      category: input.category !== undefined ? input.category : existing.category,
      date: input.date !== undefined ? input.date : existing.date,
    },
  });

  return updatedItem;
};

export const deleteGalleryItem = async (id: string) => {
  try {
    const existing = await prisma.universityGallery.findUnique({ where: { id } });
    if (existing) {
      if (existing.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
        } catch (err) {
          console.warn('Failed to delete image from Cloudinary:', err);
        }
      }
      await prisma.universityGallery.delete({ where: { id } });
    }
  } catch (error) {
    console.warn('[Gallery Deletion Notice]:', error);
  }

  return { message: 'University gallery photo deleted successfully', deletedId: id };
};
