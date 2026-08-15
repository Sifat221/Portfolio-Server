import prisma from '../config/prisma';
import { cloudinary } from '../config/cloudinary';
import projectsData from '../../data/projects.json';
import { CreateProjectInput } from '../types';
import ApiError from '../errors/ApiError';

interface IFallbackProject {
  id?: string;
  name: string;
  tagline?: string;
  techStack?: string[];
  features?: string[];
  github?: string;
  demo?: string;
}

export const fetchAllProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (projects && projects.length > 0) {
      return { count: projects.length, data: projects, isFallback: false };
    }
  } catch (error) {
    // Database fallback
  }

  return { count: projectsData.length, data: projectsData, isFallback: true };
};

export const fetchProjectById = async (id: string) => {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (project) {
      return { data: project, isFallback: false };
    }
  } catch (error) {
    // Database fallback
  }

  const fallbackProject = (projectsData as IFallbackProject[]).find(
    (p) => (p.id && p.id === id) || p.name.toLowerCase() === id.toLowerCase()
  );

  if (fallbackProject) {
    return { data: fallbackProject, isFallback: true };
  }

  throw new ApiError(404, `Project not found with id: ${id}`);
};

export const createNewProject = async (input: any, file?: Express.Multer.File) => {
  const { title, tagline, description, techStack, features, githubUrl, githubLabel, demoUrl, demoLabel, androidUrl, iosUrl, imageUrl, cloudinaryPublicId, isFeatured } = input;

  if (!title || !description) {
    throw new ApiError(400, 'Title and description are required fields');
  }

  let finalImageUrl: string | null = imageUrl || null;
  let finalPublicId: string | null = cloudinaryPublicId || null;

  if (file) {
    finalImageUrl = (file as any).path;
    finalPublicId = (file as any).filename;
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
      githubLabel: githubLabel || null,
      demoUrl: demoUrl || null,
      demoLabel: demoLabel || null,
      androidUrl: androidUrl || null,
      iosUrl: iosUrl || null,
      imageUrl: finalImageUrl,
      cloudinaryPublicId: finalPublicId,
      isFeatured: isFeatured === true || isFeatured === 'true',
    },
  });

  return project;
};

export const updateExistingProject = async (id: string, bodyData: any, file?: Express.Multer.File) => {
  let existingProject = null;
  try {
    existingProject = await prisma.project.findUnique({ where: { id } });
  } catch (err) {
    // Ignore error
  }

  const updateData: Record<string, any> = { ...bodyData };

  if (typeof updateData.techStack === 'string') {
    updateData.techStack = JSON.parse(updateData.techStack);
  }
  if (typeof updateData.features === 'string') {
    updateData.features = JSON.parse(updateData.features);
  }
  if (typeof updateData.isFeatured === 'string') {
    updateData.isFeatured = updateData.isFeatured === 'true';
  }

  if (file) {
    if (existingProject?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existingProject.cloudinaryPublicId);
      } catch (err) {
        console.warn('[Cloudinary Purge Warning]:', err);
      }
    }
    updateData.imageUrl = (file as any).path;
    updateData.cloudinaryPublicId = (file as any).filename;
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    return project;
  } catch (error: any) {
    throw new ApiError(404, `Failed to update project: ${error.message}`);
  }
};

export const deleteExistingProject = async (id: string) => {
  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (project) {
      if (project.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(project.cloudinaryPublicId);
          console.log(`[Cloudinary] Purged asset ${project.cloudinaryPublicId} on project deletion.`);
        } catch (cloudinaryErr) {
          console.warn('[Cloudinary Purge Warning]:', cloudinaryErr);
        }
      }
      await prisma.project.delete({ where: { id } });
    }
  } catch (error: any) {
    console.warn('[Project Deletion Notice]:', error.message);
  }
  return { success: true, message: 'Project deleted successfully' };
};
