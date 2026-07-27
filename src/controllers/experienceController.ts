import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import experienceData from '../../data/experience.json';

// @desc    Get experience history
// @route   GET /api/experience
// @access  Public
export const getExperience = asyncHandler(async (req: Request, res: Response) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (experience && experience.length > 0) {
      res.status(200).json({ success: true, count: experience.length, data: experience });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: experienceData });
});

// @desc    Create experience record
// @route   POST /api/experience
// @access  Private / Admin
export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const { role, company, location, startDate, endDate, responsibilities, technologies, impact } = req.body;
  if (!role || !company || !startDate) {
    res.status(400);
    throw new Error('Role, company, and start date are required');
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

  res.status(201).json({ success: true, data: experience });
});
