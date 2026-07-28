import prisma from '../config/prisma';
import educationData from '../../data/education.json';
import { CreateEducationInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllEducation = async () => {
  try {
    const education = await prisma.education.findMany({ orderBy: { createdAt: 'desc' } });
    if (education && education.length > 0) {
      return { count: education.length, data: education, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: educationData.length, data: educationData, isFallback: true };
};

export const createNewEducation = async (input: CreateEducationInput) => {
  const { degree, institution, timeline, relevantCourses } = input;
  if (!degree || !institution) {
    throw new ApiError(400, 'Degree and institution are required');
  }

  const education = await prisma.education.create({
    data: { degree, institution, timeline: timeline || '', relevantCourses: relevantCourses || [] },
  });
  return education;
};

export const deleteExistingEducation = async (id: string) => {
  await prisma.education.delete({ where: { id } });
  return { message: 'Education record deleted' };
};
