import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import achievementsData from '../../data/achievements.json';

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } });
    if (achievements && achievements.length > 0) {
      res.status(200).json({ success: true, count: achievements.length, data: achievements });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: achievementsData });
});

export const createAchievement = asyncHandler(async (req: Request, res: Response) => {
  const { title, category, description, year } = req.body;
  if (!title || !category || !description) {
    res.status(400);
    throw new Error('Title, category, and description are required');
  }
  const achievement = await prisma.achievement.create({
    data: { title, category, description, year },
  });
  res.status(201).json({ success: true, data: achievement });
});

export const deleteAchievement = asyncHandler(async (req: Request, res: Response) => {
  await prisma.achievement.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Achievement deleted' });
});
