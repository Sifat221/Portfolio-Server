import { Response } from 'express';

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  isFallback?: boolean;
  count?: number;
  data?: T;
  cloudinaryResult?: any;
}

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: Record<string, any> = {
    statusCode: data.statusCode,
    success: data.success,
  };

  if (data.message !== undefined) {
    responseData.message = data.message;
  }
  if (data.isFallback !== undefined) {
    responseData.isFallback = data.isFallback;
  }
  if (data.count !== undefined) {
    responseData.count = data.count;
  }
  if (data.data !== undefined) {
    responseData.data = data.data;
  }
  if (data.cloudinaryResult !== undefined) {
    responseData.cloudinaryResult = data.cloudinaryResult;
  }

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
