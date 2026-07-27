import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import skillsData from '../../data/skills.json';

// @desc    Get skills
// @route   GET /api/skills
// @access  Public
export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany();
    if (skills && skills.length > 0) {
      res.status(200).json({ success: true, count: skills.length, data: skills });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: skillsData });
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private / Admin
export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, iconUrl, proficiency } = req.body;
  if (!name || !category) {
    res.status(400);
    throw new Error('Skill name and category are required');
  }
  const skill = await prisma.skill.create({
    data: { name, category, iconUrl, proficiency },
  });
  res.status(201).json({ success: true, data: skill });
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private / Admin
export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.skill.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Skill deleted successfully' });
});
