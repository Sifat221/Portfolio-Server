import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import educationData from '../../data/education.json';

export const getEducation = asyncHandler(async (req: Request, res: Response) => {
  try {
    const education = await prisma.education.findMany({ orderBy: { createdAt: 'desc' } });
    if (education && education.length > 0) {
      res.status(200).json({ success: true, count: education.length, data: education });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: educationData });
});

export const createEducation = asyncHandler(async (req: Request, res: Response) => {
  const { degree, institution, timeline, relevantCourses } = req.body;
  if (!degree || !institution) {
    res.status(400);
    throw new Error('Degree and institution are required');
  }
  const education = await prisma.education.create({
    data: { degree, institution, timeline, relevantCourses: relevantCourses || [] },
  });
  res.status(201).json({ success: true, data: education });
});

export const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Education record deleted' });
});
