/**
 * File Manager - Platform-wide file and media management
 * Handles Cloudinary integration, file uploads, optimization, etc.
 */

export interface FileMetadata {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  folder: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadOptions {
  folder?: string;
  tags?: string[];
  transform?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
  };
  generateThumbnail?: boolean;
}

export interface Folder {
  name: string;
  path: string;
  userId: string;
  fileCount: number;
  createdAt: Date;
}

export class FileManager {
  private files: Map<string, FileMetadata> = new Map();
  private folders: Map<string, Folder[]> = new Map();

  /**
   * Register a file
   */
  registerFile(metadata: Omit<FileMetadata, 'id' | 'createdAt' | 'updatedAt'>): FileMetadata {
    const file: FileMetadata = {
      ...metadata,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.files.set(file.id, file);
    return file;
  }

  /**
   * Get file by ID
   */
  getFile(id: string): FileMetadata | undefined {
    return this.files.get(id);
  }

  /**
   * Get files by user
   */
  getUserFiles(userId: string, folder?: string): FileMetadata[] {
    let files = Array.from(this.files.values()).filter(f => f.userId === userId);

    if (folder) {
      files = files.filter(f => f.folder === folder);
    }

    return files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get files by folder
   */
  getFilesByFolder(userId: string, folder: string): FileMetadata[] {
    return this.getUserFiles(userId, folder);
  }

  /**
   * Delete file
   */
  deleteFile(id: string): boolean {
    return this.files.delete(id);
  }

  /**
   * Create folder
   */
  createFolder(userId: string, folderName: string, parentPath: string = ''): Folder {
    const path = parentPath ? `${parentPath}/${folderName}` : folderName;
    
    const folder: Folder = {
      name: folderName,
      path,
      userId,
      fileCount: 0,
      createdAt: new Date()
    };

    const userFolders = this.folders.get(userId) || [];
    userFolders.push(folder);
    this.folders.set(userId, userFolders);

    return folder;
  }

  /**
   * Get user folders
   */
  getUserFolders(userId: string): Folder[] {
    return this.folders.get(userId) || [];
  }

  /**
   * Search files
   */
  searchFiles(userId: string, query: string, limit: number = 50): FileMetadata[] {
    const queryLower = query.toLowerCase();
    
    const files = Array.from(this.files.values())
      .filter(f => f.userId === userId)
      .filter(f => 
        f.filename.toLowerCase().includes(queryLower) ||
        f.originalName.toLowerCase().includes(queryLower) ||
        f.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, limit);

    return files;
  }

  /**
   * Get storage statistics
   */
  getStorageStats(userId: string): {
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
    filesByFolder: Record<string, number>;
  } {
    const userFiles = Array.from(this.files.values()).filter(f => f.userId === userId);
    
    const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
    const filesByType: Record<string, number> = {};
    const filesByFolder: Record<string, number> = {};

    for (const file of userFiles) {
      // By type
      const type = file.mimeType.split('/')[0];
      filesByType[type] = (filesByType[type] || 0) + 1;

      // By folder
      filesByFolder[file.folder] = (filesByFolder[file.folder] || 0) + 1;
    }

    return {
      totalFiles: userFiles.length,
      totalSize,
      filesByType,
      filesByFolder
    };
  }

  /**
   * Generate signed URL for secure access
   */
  generateSignedUrl(fileId: string, expiresIn: number = 3600): { url: string; expiresAt: Date } {
    const file = this.files.get(fileId);
    
    if (!file) {
      throw new Error('File not found');
    }

    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    // In production, this would generate a signed URL with Cloudinary or S3
    return {
      url: file.url,
      expiresAt
    };
  }

  /**
   * Update file metadata
   */
  updateFileMetadata(id: string, updates: Partial<Pick<FileMetadata, 'tags' | 'folder' | 'metadata'>>): FileMetadata | undefined {
    const file = this.files.get(id);
    
    if (!file) return undefined;

    const updated = {
      ...file,
      ...updates,
      updatedAt: new Date()
    };

    this.files.set(id, updated);
    return updated;
  }

  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global file manager instance
export const fileManager = new FileManager();