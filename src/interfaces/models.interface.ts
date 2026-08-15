export interface IPersonalProfile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  location?: string | null;
  availability?: string | null;
  email?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  github?: string | null;
  portfolio?: string | null;
  profilePhoto?: string | null;
  bannerPhoto?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  cloudinaryPublicId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProject {
  id?: string;
  title: string;
  tagline?: string | null;
  description: string;
  techStack?: string[];
  features?: string[];
  githubUrl?: string | null;
  githubLabel?: string | null;
  demoUrl?: string | null;
  demoLabel?: string | null;
  imageUrl?: string | null;
  cloudinaryPublicId?: string | null;
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
  createdAt?: Date;
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
  createdAt?: Date;
}

export interface IEducation {
  id?: string;
  degree: string;
  institution: string;
  timeline: string;
  relevantCourses?: string[];
  createdAt?: Date;
}

export interface ICertification {
  id?: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  createdAt?: Date;
}

export interface IAchievement {
  id?: string;
  title: string;
  category: string;
  description: string;
  year?: string | null;
  createdAt?: Date;
}

export interface ITestimonial {
  id?: string;
  client: string;
  company?: string | null;
  text: string;
  rating?: number;
  createdAt?: Date;
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
  createdAt?: Date;
}

export interface IUniversityGallery {
  id?: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  institution?: string | null;
  category?: string | null;
  date?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
