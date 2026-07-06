import { Request, Response } from 'express';
import { Project } from '@pv/database';
import { CreateProjectValidation, UpdateProjectValidation } from '@pv/database';
import { asyncHandler } from '@pv/utils';
import { successResponse, errorResponse, paginatedResponse } from '@pv/utils';
import { logger } from '@pv/utils';

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { status, featured, page = 1, limit = 10 } = req.query;

    const filter: any = { userId };
    
    if (status) {
      filter.status = status;
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    return paginatedResponse(res, projects, Number(page), Number(limit), total, 'Projects fetched successfully');
  } catch (error) {
    logger.error('Get projects error:', error);
    return errorResponse(res, 'Error fetching projects', 500, error);
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    return successResponse(res, project, 'Project fetched successfully');
  } catch (error) {
    logger.error('Get project error:', error);
    return errorResponse(res, 'Error fetching project', 500, error);
  }
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    // Validate input
    const validatedData = CreateProjectValidation.parse(req.body);

    const project = await Project.create({
      ...validatedData,
      userId,
    });

    logger.info(`Project created: ${project.name} by user ${userId}`);

    return successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    logger.error('Create project error:', error);
    return errorResponse(res, 'Error creating project', 500, error);
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Validate input
    const validatedData = UpdateProjectValidation.parse(req.body);

    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    logger.info(`Project updated: ${project.name}`);

    return successResponse(res, project, 'Project updated successfully');
  } catch (error) {
    logger.error('Update project error:', error);
    return errorResponse(res, 'Error updating project', 500, error);
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    logger.info(`Project deleted: ${project.name}`);

    return successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    logger.error('Delete project error:', error);
    return errorResponse(res, 'Error deleting project', 500, error);
  }
});