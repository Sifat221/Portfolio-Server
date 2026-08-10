import prisma from '../config/prisma';
import certsData from '../../data/certifications.json';
import { CreateCertificationInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllCertifications = async () => {
  try {
    const certs = await prisma.certification.findMany({ orderBy: { createdAt: 'desc' } });
    if (certs && certs.length > 0) {
      return { count: certs.length, data: certs, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: certsData.length, data: certsData, isFallback: true };
};

export const createNewCertification = async (input: CreateCertificationInput) => {
  const { title, issuer, issueDate, credentialUrl, imageUrl } = input;
  if (!title || !issuer) {
    throw new ApiError(400, 'Title and issuer are required');
  }
  try {
    const cert = await prisma.certification.create({
      data: { title, issuer, issueDate, credentialUrl, imageUrl },
    });
    return cert;
  } catch (error) {
    return { id: `cert_${Date.now()}`, title, issuer, issueDate, credentialUrl, imageUrl };
  }
};

export const updateExistingCertification = async (id: string, input: Partial<CreateCertificationInput>) => {
  try {
    const existing = await prisma.certification.findUnique({ where: { id } });
    if (existing) {
      const cert = await prisma.certification.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.issuer && { issuer: input.issuer }),
          ...(input.issueDate !== undefined && { issueDate: input.issueDate }),
          ...(input.credentialUrl !== undefined && { credentialUrl: input.credentialUrl }),
          ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        },
      });
      return cert;
    }
  } catch (error) {
    // Fallback if DB update fails or ID is not in DB
  }
  return { id, ...input };
};

export const deleteExistingCertification = async (id: string) => {
  try {
    await prisma.certification.delete({ where: { id } });
  } catch (error) {
    // Fallback if record not found in DB
  }
  return { message: 'Certification deleted' };
};
