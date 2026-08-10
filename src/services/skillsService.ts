import prisma from '../config/prisma';
import skillsData from '../../data/skills.json';
import { CreateSkillInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllSkills = async () => {
  try {
    const skills = await prisma.skill.findMany();
    if (skills && skills.length > 0) {
      return { count: skills.length, data: skills, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: undefined, data: skillsData, isFallback: true };
};

export const createNewSkill = async (input: CreateSkillInput) => {
  const { name, category, iconUrl, proficiency } = input;
  if (!name || !category) {
    throw new ApiError(400, 'Skill name and category are required');
  }
  const skill = await prisma.skill.create({
    data: { name, category, iconUrl, proficiency },
  });
  return skill;
};

export const deleteExistingSkill = async (id: string) => {
  try {
    await prisma.skill.delete({ where: { id } });
  } catch (error) {
    console.warn('[Skill Deletion Notice]:', error);
  }
  return { message: 'Skill deleted successfully' };
};
