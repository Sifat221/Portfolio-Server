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
  const { title, issuer, issueDate, credentialUrl } = input;
  if (!title || !issuer) {
    throw new ApiError(400, 'Title and issuer are required');
  }
  const cert = await prisma.certification.create({
    data: { title, issuer, issueDate, credentialUrl },
  });
  return cert;
};

export const deleteExistingCertification = async (id: string) => {
  await prisma.certification.delete({ where: { id } });
  return { message: 'Certification deleted' };
};
