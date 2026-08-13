export interface CreateProjectInput {
  title: string;
  tagline?: string;
  description: string;
  techStack?: string | string[];
  features?: string | string[];
  githubUrl?: string;
  demoUrl?: string;
  androidUrl?: string;
  iosUrl?: string;
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
  imageUrl?: string;
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

export interface LoginInput {
  idToken?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UpdatePersonalProfileInput {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  availability?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  github?: string;
  portfolio?: string;
  profilePhoto?: string;
  bannerPhoto?: string;
  linkedin?: string;
  facebook?: string;
}

export interface CreateUniversityGalleryInput {
  title: string;
  description?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  institution?: string;
  category?: string;
  date?: string;
}

export interface UpdateUniversityGalleryInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  institution?: string;
  category?: string;
  date?: string;
}

