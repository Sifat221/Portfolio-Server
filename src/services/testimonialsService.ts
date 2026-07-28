import prisma from '../config/prisma';
import testimonialsData from '../../data/testimonials.json';
import { CreateTestimonialInput } from '../types';
import ApiError from '../errors/ApiError';

export const fetchAllTestimonials = async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    if (testimonials && testimonials.length > 0) {
      return { count: testimonials.length, data: testimonials, isFallback: false };
    }
  } catch (error) {
    // Fallback search
  }

  return { count: testimonialsData.length, data: testimonialsData, isFallback: true };
};

export const createNewTestimonial = async (input: CreateTestimonialInput) => {
  const { client, company, text, rating } = input;
  if (!client || !text) {
    throw new ApiError(400, 'Client name and testimonial text are required');
  }
  const testimonial = await prisma.testimonial.create({
    data: { client, company, text, rating: rating || 5 },
  });
  return testimonial;
};

export const deleteExistingTestimonial = async (id: string) => {
  await prisma.testimonial.delete({ where: { id } });
  return { message: 'Testimonial deleted' };
};
