import { Request, Response } from 'express';
import { Project } from '../models/Project';

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { status, featured } = req.query;

    const filter: any = { userId };
    
    if (status) {
      filter.status = status;
    }
    
    if (featured !== undefined) {
      filter.settings = { ...filter.settings, featured: featured === 'true' };
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, description, techStack, urls, status, settings } = req.body;

    const project = await Project.create({
      userId,
      name,
      description,
      techStack: techStack || [],
      urls: urls || {},
      status: status || 'active',
      settings: settings || { public: true, featured: false },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const updates = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
