import { v2 as cloudinary } from 'cloudinary';

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: any[];
}

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: Date;
}

export class CloudinaryService {
  private configured: boolean = false;

  configure() {
    if (this.configured) return;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    this.configured = true;
  }

  async upload(filePath: string, options: UploadOptions = {}): Promise<UploadResult> {
    this.configure();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          folder: options.folder || 'pv-platform',
          tags: options.tags || [],
          transformation: options.transformation
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes,
              createdAt: new Date(result.created_at)
            });
          } else {
            reject(new Error('Upload failed'));
          }
        }
      );
    });
  }

  async delete(publicId: string): Promise<void> {
    this.configure();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getUrl(publicId: string, options?: any): string {
    return cloudinary.url(publicId, options);
  }

  getSecureUrl(publicId: string, options?: any): string {
    return cloudinary.url(publicId, { secure: true, ...options });
  }
}

export const cloudinaryService = new CloudinaryService();