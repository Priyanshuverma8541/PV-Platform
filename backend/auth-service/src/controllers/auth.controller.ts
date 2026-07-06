import { Request, Response } from 'express';
import { User } from '@pv/database';
import { RegisterValidation, LoginValidation } from '@pv/database';
import { asyncHandler } from '@pv/utils';
import { successResponse, errorResponse } from '@pv/utils';
import { generateToken } from '@pv/utils';
import { env } from '@pv/config';
import { logger } from '@pv/utils';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = RegisterValidation.parse(req.body);
    
    // Check if user exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    // Create verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: validatedData.password,
      profile: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      },
      verificationToken,
    });

    // Generate token
    const token = generateToken({ userId: String(user._id) }, env.JWT_SECRET, env.JWT_EXPIRES_IN);

    logger.info(`User registered: ${user.email}`);

    return successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        emailVerified: user.emailVerified,
      },
      token,
    }, 'User registered successfully', 201);
  } catch (error) {
    logger.error('Register error:', error);
    return errorResponse(res, 'Error registering user', 500, error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = LoginValidation.parse(req.body);
    
    // Find user with password
    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check password
    const { comparePassword } = await import('@pv/utils');
    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ userId: String(user._id) }, env.JWT_SECRET, env.JWT_EXPIRES_IN);

    logger.info(`User logged in: ${user.email}`);

    return successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        emailVerified: user.emailVerified,
        settings: user.settings,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, 'Error logging in', 500, error);
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        emailVerified: user.emailVerified,
        settings: user.settings,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Get me error:', error);
    return errorResponse(res, 'Error fetching user', 500, error);
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return errorResponse(res, 'Invalid verification token', 400);
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    logger.info(`Email verified: ${user.email}`);

    return successResponse(res, null, 'Email verified successfully');
  } catch (error) {
    logger.error('Verify email error:', error);
    return errorResponse(res, 'Error verifying email', 500, error);
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send reset email
    // For now, just log it
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    return successResponse(res, null, 'Password reset email sent');
  } catch (error) {
    logger.error('Forgot password error:', error);
    return errorResponse(res, 'Error sending reset email', 500, error);
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset for: ${user.email}`);

    return successResponse(res, null, 'Password reset successful');
  } catch (error) {
    logger.error('Reset password error:', error);
    return errorResponse(res, 'Error resetting password', 500, error);
  }
});