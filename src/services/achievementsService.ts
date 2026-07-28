import prisma from '../config/prisma';
import achievementsData from '../../data/achievements.json';
import { CreateAchievementInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllAchievements = async () => {
  try {
    const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } });
    if (achievements && achievements.length > 0) {
      return { count: achievements.length, data: achievements, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: achievementsData.length, data: achievementsData, isFallback: true };
};

export const createNewAchievement = async (input: CreateAchievementInput) => {
  const { title, category, description, year } = input;
  if (!title || !category || !description) {
    throw new ApiError(400, 'Title, category, and description are required');
  }
  const achievement = await prisma.achievement.create({
    data: { title, category, description, year },
  });
  return achievement;
};

export const deleteExistingAchievement = async (id: string) => {
  await prisma.achievement.delete({ where: { id } });
  return { message: 'Achievement deleted' };
};
