export interface CreateProjectInput {
  title: string;
  tagline?: string;
  description: string;
  techStack?: string | string[];
  features?: string | string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isFeatured?: boolean | string;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  iconUrl?: string;
  proficiency?: string;
}

export interface CreateExperienceInput {
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string[];
  technologies?: string[];
  impact?: string;
}

export interface CreateEducationInput {
  degree: string;
  institution: string;
  timeline?: string;
  relevantCourses?: string[];
}

export interface CreateCertificationInput {
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface CreateAchievementInput {
  title: string;
  category: string;
  description: string;
  year?: string;
}

export interface CreateTestimonialInput {
  client: string;
  company?: string;
  text: string;
  rating?: number;
}

export interface SubmitContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface UpdateMediaInput {
  assetType?: string;
  filename?: string;
}

export interface BulkDeleteMediaInput {
  publicIds: string[];
}
