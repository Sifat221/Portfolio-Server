import { Response } from 'express';
import catchAsync from '../shared/catchAsync';
import sendResponse from '../shared/sendResponse';
import { AuthenticatedRequest } from '../types';
import {
  fetchAllProjects,
  fetchProjectById,
  createNewProject,
  updateExistingProject,
  deleteExistingProject,
} from '../services/projectsService';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await fetchAllProjects();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    count: result.count,
    data: result.data,
  });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await fetchProjectById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    ...(result.isFallback ? { isFallback: true } : {}),
    data: result.data,
  });
});

// @desc    Create a new project (with optional Cloudinary photo upload)
// @route   POST /api/projects
// @access  Private / Admin
export const createProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const project = await createNewProject(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    data: project,
  });
});

// @desc    Update a project (with optional new Cloudinary photo upload)
// @route   PUT /api/projects/:id
// @access  Private / Admin
export const updateProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const project = await updateExistingProject(id, req.body, req.file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: project,
  });
});

// @desc    Delete a project & purge its photo from Cloudinary CDN
// @route   DELETE /api/projects/:id
// @access  Private / Admin
export const deleteProject = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await deleteExistingProject(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});
