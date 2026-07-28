import prisma from '../config/prisma';
import admin from '../config/firebase';
import { LoginInput, IUserPayload, IAuthUser } from '../types';
import ApiError from '../errors/ApiError';

// Login User & generate role metadata with dashboard & logout permissions
export const loginUser = async (input: LoginInput, roleHeader?: string): Promise<{ token: string; user: IAuthUser }> => {
  const { idToken, email, password } = input;

  let uid = 'admin-user-id';
  let userEmail = email || 'sifatkhanjoy996@gmail.com';
  let userName = 'Sifat Khan (Admin)';
  let role: 'ADMIN' | 'VIEWER' = 'ADMIN';

  // If Firebase ID Token is provided, verify via Firebase Admin SDK
  if (idToken) {
    try {
      if (admin && admin.auth) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        userEmail = decodedToken.email || userEmail;
        userName = decodedToken.name || userName;
        role = decodedToken.role || (decodedToken.admin ? 'ADMIN' : 'ADMIN');
      }
    } catch (err: any) {
      throw new ApiError(401, `Firebase authentication failed: ${err.message}`);
    }
  } else {
    // If testing or header-based authentication is provided
    const targetRole = (roleHeader || input.role || 'ADMIN').toUpperCase();
    role = targetRole === 'ADMIN' ? 'ADMIN' : 'VIEWER';
  }

  const isUserAdmin = role === 'ADMIN';

  const authUser: IAuthUser = {
    uid,
    email: userEmail,
    name: userName,
    role,
    canAccessDashboard: isUserAdmin,
    canLogout: isUserAdmin,
  };

  return {
    token: idToken || `mock-admin-token-${Date.now()}`,
    user: authUser,
  };
};

// Logout User
export const logoutUser = async (user?: IUserPayload) => {
  if (user && user.role !== 'ADMIN') {
    throw new ApiError(403, 'Forbidden: Viewers and Guest users cannot access logout action');
  }
  return { message: 'Successfully logged out. Session invalidated.' };
};

// Get authenticated user profile with role permissions
export const getAuthProfile = async (user?: IUserPayload): Promise<IAuthUser> => {
  if (!user) {
    return {
      uid: 'guest-viewer',
      email: 'guest@portfolio.com',
      name: 'Guest Viewer',
      role: 'VIEWER',
      canAccessDashboard: false,
      canLogout: false,
    };
  }

  const isUserAdmin = user.role === 'ADMIN';

  return {
    uid: user.uid,
    email: user.email || 'sifatkhanjoy996@gmail.com',
    name: user.name || 'Sifat Khan (Admin)',
    role: user.role,
    canAccessDashboard: isUserAdmin,
    canLogout: isUserAdmin,
  };
};

// Get Admin Dashboard Overview Statistics
export const getDashboardAnalytics = async () => {
  try {
    const [projectsCount, skillsCount, experienceCount, educationCount, certsCount, contactCount, mediaCount] =
      await Promise.all([
        prisma.project.count().catch(() => 0),
        prisma.skill.count().catch(() => 0),
        prisma.experience.count().catch(() => 0),
        prisma.education.count().catch(() => 0),
        prisma.certification.count().catch(() => 0),
        prisma.contactMessage.count().catch(() => 0),
        prisma.mediaAsset.count().catch(() => 0),
      ]);

    return {
      overview: {
        totalProjects: projectsCount,
        totalSkills: skillsCount,
        totalExperience: experienceCount,
        totalEducation: educationCount,
        totalCertifications: certsCount,
        totalContactMessages: contactCount,
        totalMediaAssets: mediaCount,
      },
      dashboardPermissions: {
        canAccessDashboard: true,
        canLogout: true,
        role: 'ADMIN',
      },
    };
  } catch (error: any) {
    throw new ApiError(500, `Failed to load dashboard analytics: ${error.message}`);
  }
};
