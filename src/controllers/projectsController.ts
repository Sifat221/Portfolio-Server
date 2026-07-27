import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import { cloudinary } from '../config/cloudinary';
import projectsData from '../../data/projects.json';
import { AuthenticatedRequest } from '../types';

interface IFallbackProject {
  id?: string;
  name: string;
  tagline?: string;
  techStack?: string[];
  features?: string[];
  github?: string;
  demo?: string;
}

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (projects && projects.length > 0) {
      res.status(200).json({ success: true, count: projects.length, data: projects });
      return;
    }
  } catch (error) {
    // Database fallback
  }

  res.status(200).json({ success: true, isFallback: true, count: projectsData.length, data: projectsData });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      res.status(200).json({ success: true, data: project });
      return;
    }
  } catch (error) {
    // Database fallback
  }

  const fallbackProject = (projectsData as IFallbackProject[]).find(
    (p) => (p.id && p.id === id) || p.name.toLowerCase() === id.toLowerCase()
  );

  if (fallbackProject) {
    res.status(200).json({ success: true, isFallback: true, data: fallbackProject });
    return;
  }

  res.status(404);
  throw new Error(`Project not found with id: ${id}`);
});

// @desc    Create a new project (with optional Cloudinary photo upload)
// @route   POST /api/projects
// @access  Private / Admin
export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, tagline, description, techStack, features, githubUrl, demoUrl, imageUrl, cloudinaryPublicId, isFeatured } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required fields');
  }

  let finalImageUrl: string | null = imageUrl || null;
  let finalPublicId: string | null = cloudinaryPublicId || null;

  // If a photo was uploaded via Multer Cloudinary storage
  if (req.file) {
    finalImageUrl = (req.file as any).path;
    finalPublicId = (req.file as any).filename;
  }

  const parsedTechStack: string[] = typeof techStack === 'string'
    ? JSON.parse(techStack)
    : (Array.isArray(techStack) ? techStack : []);

  const parsedFeatures: string[] = typeof features === 'string'
    ? JSON.parse(features)
    : (Array.isArray(features) ? features : []);

  const project = await prisma.project.create({
    data: {
      title,
      tagline: tagline || null,
      description,
      techStack: parsedTechStack,
      features: parsedFeatures,
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      imageUrl: finalImageUrl,
      cloudinaryPublicId: finalPublicId,
      isFeatured: isFeatured === true || isFeatured === 'true',
    },
  });

  res.status(201).json({ success: true, data: project });
});

// @desc    Update a project (with optional new Cloudinary photo upload)
// @route   PUT /api/projects/:id
// @access  Private / Admin
export const updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  let existingProject = null;
  try {
    existingProject = await prisma.project.findUnique({ where: { id } });
  } catch (err) {
    // Ignore error
  }

  const updateData: Record<string, any> = { ...req.body };

  if (typeof updateData.techStack === 'string') {
    updateData.techStack = JSON.parse(updateData.techStack);
  }
  if (typeof updateData.features === 'string') {
    updateData.features = JSON.parse(updateData.features);
  }
  if (typeof updateData.isFeatured === 'string') {
    updateData.isFeatured = updateData.isFeatured === 'true';
  }

  // If a new photo is uploaded, purge old image from Cloudinary CDN
  if (req.file) {
    if (existingProject?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existingProject.cloudinaryPublicId);
      } catch (err) {
        console.warn('[Cloudinary Purge Warning]:', err);
      }
    }
    updateData.imageUrl = (req.file as any).path;
    updateData.cloudinaryPublicId = (req.file as any).filename;
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(404);
    throw new Error(`Failed to update project: ${error.message}`);
  }
});

// @desc    Delete a project & purge its photo from Cloudinary CDN
// @route   DELETE /api/projects/:id
// @access  Private / Admin
export const deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (project?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(project.cloudinaryPublicId);
        console.log(`[Cloudinary] Purged asset ${project.cloudinaryPublicId} on project deletion.`);
      } catch (cloudinaryErr) {
        console.warn('[Cloudinary Purge Warning]:', cloudinaryErr);
      }
    }

    await prisma.project.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Project and associated Cloudinary assets deleted successfully' });
  } catch (error: any) {
    res.status(404);
    throw new Error(`Project deletion failed or project not found with id: ${id}`);
  }
});
