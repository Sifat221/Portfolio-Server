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

export interface IApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message?: string;
  isFallback?: boolean;
  count?: number;
  data?: T;
  cloudinaryResult?: any;
}
