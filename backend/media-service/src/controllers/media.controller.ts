import { Request, Response } from 'express';
import { Media } from '@pv/database';
import { asyncHandler } from '@pv/utils';
import { successResponse, errorResponse, paginatedResponse } from '@pv/utils';
import { logger } from '@pv/utils';

// @desc    Upload media
// @route   POST /api/media/upload
// @access  Private
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  try {
    // TODO: Implement file upload with Cloudinary
    // For now, return a placeholder response
    logger.info('Media upload requested');
    
    return successResponse(res, {
      url: 'https://placeholder.com/image.jpg',
      filename: 'placeholder.jpg',
    }, 'Media uploaded successfully', 201);
  } catch (error) {
    logger.error('Upload media error:', error);
    return errorResponse(res, 'Error uploading media', 500, error);
  }
});

// @desc    Get all media for user
// @route   GET /api/media
// @access  Private
export const getMedia = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { page = 1, limit = 10, mimeType, folder } = req.query;

    const filter: any = { userId };
    
    if (mimeType) {
      filter.mimeType = mimeType;
    }
    
    if (folder) {
      filter.folder = folder;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [media, total] = await Promise.all([
      Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Media.countDocuments(filter),
    ]);

    return paginatedResponse(res, media, Number(page), Number(limit), total, 'Media fetched successfully');
  } catch (error) {
    logger.error('Get media error:', error);
    return errorResponse(res, 'Error fetching media', 500, error);
  }
});

// @desc    Get single media
// @route   GET /api/media/:id
// @access  Private
export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const media = await Media.findOne({ _id: id, userId });

    if (!media) {
      return errorResponse(res, 'Media not found', 404);
    }

    return successResponse(res, media, 'Media fetched successfully');
  } catch (error) {
    logger.error('Get media by id error:', error);
    return errorResponse(res, 'Error fetching media', 500, error);
  }
});

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const media = await Media.findOneAndDelete({ _id: id, userId });

    if (!media) {
      return errorResponse(res, 'Media not found', 404);
    }

    // TODO: Delete from Cloudinary if needed

    logger.info(`Media deleted: ${media.filename}`);

    return successResponse(res, null, 'Media deleted successfully');
  } catch (error) {
    logger.error('Delete media error:', error);
    return errorResponse(res, 'Error deleting media', 500, error);
  }
});