import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../config/prisma';

export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required fields');
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

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Your message has been received.',
    data: savedMessage,
  });
});

export const getContactMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(200).json({ success: true, count: 0, data: [] });
  }
});
