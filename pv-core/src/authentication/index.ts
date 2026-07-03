import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface User {
  _id?: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
  oauth?: {
    google?: { id: string; email: string };
    github?: { id: string; username: string };
  };
  settings: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export class AuthenticationService {
  private jwtSecret: string;
  private jwtExpiration: string = '7d';

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string, email: string): AuthToken {
    const token = jwt.sign(
      { userId, email },
      this.jwtSecret as jwt.Secret,
      { expiresIn: this.jwtExpiration } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId, email, type: 'refresh' },
      this.jwtSecret as jwt.Secret,
      { expiresIn: '30d' } as jwt.SignOptions
    );

    return {
      token,
      refreshToken,
      expiresIn: this.jwtExpiration
    };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  async validateUser(_email: string, password: string, user: User): Promise<boolean> {
    if (!user.password) return false;
    return this.comparePassword(password, user.password);
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    return {
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      profile: userData.profile || { firstName: '', lastName: '', avatar: '', bio: '' },
      settings: { twoFactorEnabled: false, emailNotifications: true, theme: 'light' },
      createdAt: new Date(),
      updatedAt: new Date()
    } as User;
  }

  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthenticationService(process.env.JWT_SECRET || 'your-secret-key');