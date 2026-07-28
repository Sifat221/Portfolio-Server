import prisma from '../config/prisma';
import experienceData from '../../data/experience.json';
import { CreateExperienceInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllExperience = async () => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (experience && experience.length > 0) {
      return { count: experience.length, data: experience, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: experienceData.length, data: experienceData, isFallback: true };
};

export const createNewExperience = async (input: CreateExperienceInput) => {
  const { role, company, location, startDate, endDate, responsibilities, technologies, impact } = input;
  if (!role || !company || !startDate) {
    throw new ApiError(400, 'Role, company, and start date are required');
  }

  const experience = await prisma.experience.create({
    data: {
      role,
      company,
      location,
      startDate,
      endDate,
      responsibilities: responsibilities || [],
      technologies: technologies || [],
      impact,
    },
  });

  return experience;
};
