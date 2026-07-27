import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';
import testimonialsData from '../../data/testimonials.json';

export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    if (testimonials && testimonials.length > 0) {
      res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
      return;
    }
  } catch (error) {
    // Fallback search
  }

  res.status(200).json({ success: true, isFallback: true, data: testimonialsData });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { client, company, text, rating } = req.body;
  if (!client || !text) {
    res.status(400);
    throw new Error('Client name and testimonial text are required');
  }
  const testimonial = await prisma.testimonial.create({
    data: { client, company, text, rating: rating || 5 },
  });
  res.status(201).json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: 'Testimonial deleted' });
});
