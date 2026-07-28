import { Response, NextFunction } from 'express';
import catchAsync from '../shared/catchAsync';
import admin from '../config/firebase';
import { AuthenticatedRequest, UserRole } from '../types';
import ApiError from '../errors/ApiError';

/**
 * @desc Protect routes - verifies Bearer token (Firebase Auth or Dev/Admin Token)
 */
export const protect = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized: Access token missing');
  }

  try {
    if (admin && admin.auth) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const role: UserRole = decodedToken.role || (decodedToken.admin ? 'ADMIN' : 'VIEWER');
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || 'admin@sifatkhan.com',
        name: decodedToken.name || 'Sifat Khan',
        role: role,
      };
    } else {
      const requestedRole = ((req.headers['x-role'] as string) || 'ADMIN').toUpperCase();
      req.user = {
        uid: 'admin-user-id',
        email: 'sifatkhanjoy996@gmail.com',
        name: 'Sifat Khan (Admin)',
        role: requestedRole === 'ADMIN' ? 'ADMIN' : 'VIEWER',
      };
    }

    next();
  } catch (error: any) {
    throw new ApiError(401, `Authentication failed: ${error.message}`);
  }
});

/**
 * @desc Authorize specific roles (e.g. authorize('ADMIN'))
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const currentRole = req.user ? req.user.role : 'GUEST / VIEWER';
      throw new ApiError(
        403,
        `Forbidden: Access restricted to [${roles.join(', ')}] roles. Your current role '${currentRole}' does not have dashboard/logout management permissions.`
      );
    }
    next();
  };
};
