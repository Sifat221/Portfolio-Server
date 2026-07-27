import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import certsData from '../../data/certifications.json';

export const getCertifications = asyncHandler(async (req: Request, res: Response) => {
  try {
    const certs = await prisma.certification.findMany({ orderBy: { createdAt: 'desc' } });
    if (certs && certs.length > 0) {
      res.status(200).json({ success: true, count: certs.length, data: certs });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: certsData });
});

export const createCertification = asyncHandler(async (req: Request, res: Response) => {
  const { title, issuer, issueDate, credentialUrl } = req.body;
  if (!title || !issuer) {
    res.status(400);
    throw new Error('Title and issuer are required');
  }
  const cert = await prisma.certification.create({
    data: { title, issuer, issueDate, credentialUrl },
  });
  res.status(201).json({ success: true, data: cert });
});

export const deleteCertification = asyncHandler(async (req: Request, res: Response) => {
  await prisma.certification.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Certification deleted' });
});
