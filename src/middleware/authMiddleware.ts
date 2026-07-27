import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import admin from '../config/firebase';
import { AuthenticatedRequest, UserRole } from '../types';

/**
 * @desc    Protect routes - verifies Bearer token (Firebase Auth or Dev Token)
 */
export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, access token missing');
  }

  try {
    if (admin && admin.auth) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const role: UserRole = decodedToken.role || (decodedToken.admin ? 'ADMIN' : 'VIEWER');
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: role,
      };
    } else {
      const requestedRole = ((req.headers['x-role'] as string) || 'ADMIN').toUpperCase();
      req.user = {
        uid: 'dev-user-id',
        email: 'sifatkhanjoy996@gmail.com',
        role: requestedRole === 'ADMIN' ? 'ADMIN' : 'VIEWER',
      };
    }

    next();
  } catch (error: any) {
    res.status(401);
    throw new Error(`Authentication failed: ${error.message}`);
  }
});

/**
 * @desc    Authorize specific roles (e.g. authorize('ADMIN'))
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden: Access restricted to [${roles.join(', ')}] roles. Your role is '${req.user ? req.user.role : 'GUEST'}'.`);
    }
    next();
  };
};
