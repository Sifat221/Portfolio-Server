import { Request } from 'express';

export type UserRole = 'ADMIN' | 'VIEWER';

export interface IUserPayload {
  uid: string;
  email?: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export interface IPersonalProfile {
  name: string;
  title: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  resumeUrl: string;
  github: string;
  portfolio: string;
}

export interface IProject {
  id?: string;
  title: string;
  tagline?: string | null;
  description: string;
  techStack?: string[];
  features?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISkill {
  id?: string;
  name: string;
  category: string;
  iconUrl?: string | null;
  proficiency?: string | null;
}

export interface IExperience {
  id?: string;
  role: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  responsibilities?: string[];
  technologies?: string[];
  impact?: string | null;
}

export interface IEducation {
  id?: string;
  degree: string;
  institution: string;
  timeline: string;
  relevantCourses?: string[];
}

export interface ICertification {
  id?: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
}

export interface IAchievement {
  id?: string;
  title: string;
  category: string;
  description: string;
  year?: string | null;
}

export interface ITestimonial {
  id?: string;
  client: string;
  company?: string | null;
  text: string;
  rating?: number;
}

export interface IContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface IMediaAsset {
  id?: string;
  url: string;
  publicId: string;
  assetType?: string;
  filename?: string | null;
  size?: number | null;
}
