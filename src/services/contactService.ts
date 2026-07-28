import prisma from '../config/prisma';
import { SubmitContactInput } from '../types';
import ApiError from '../errors/ApiError';

export const saveContactMessage = async (input: SubmitContactInput) => {
  const { name, email, subject, message } = input;

  if (!name || !email || !message) {
    throw new ApiError(400, 'Name, email, and message are required fields');
  }

  let savedMessage: any = null;

  try {
    savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || 'Portfolio Contact Inquiry',
        message,
      },
    });
  } catch (error: any) {
    console.warn('[Contact Controller] DB Save Warning:', error.message);
    savedMessage = { id: `mock-${Date.now()}`, name, email, subject, message, createdAt: new Date() };
  }

  return savedMessage;
};

export const fetchAllContactMessages = async () => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { count: messages.length, data: messages };
  } catch (error) {
    return { count: 0, data: [] };
  }
};
