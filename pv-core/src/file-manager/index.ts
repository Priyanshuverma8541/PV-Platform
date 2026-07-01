export interface FileMetadata {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  cloudinaryPublicId?: string;
  folder: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  userId: string;
  createdAt: Date;
}

export class FileManager {
  private files: Map<string, FileMetadata[]> = new Map();
  private folders: Map<string, Folder[]> = new Map();

  async uploadFile(fileData: {
    userId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    cloudinaryPublicId?: string;
    folder?: string;
    tags?: string[];
  }): Promise<FileMetadata> {
    const file: FileMetadata = {
      ...fileData,
      id: this.generateId(),
      folder: fileData.folder || 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userFiles = this.files.get(fileData.userId) || [];
    userFiles.push(file);
    this.files.set(fileData.userId, userFiles);

    return file;
  }

  async getFiles(userId: string, folder?: string): Promise<FileMetadata[]> {
    const userFiles = this.files.get(userId) || [];
    return folder ? userFiles.filter(f => f.folder === folder) : userFiles;
  }

  async getFile(userId: string, fileId: string): Promise<FileMetadata | null> {
    const userFiles = this.files.get(userId) || [];
    return userFiles.find(f => f.id === fileId) || null;
  }

  async deleteFile(userId: string, fileId: string): Promise<boolean> {
    const userFiles = this.files.get(userId) || [];
    const index = userFiles.findIndex(f => f.id === fileId);
    
    if (index === -1) return false;

    userFiles.splice(index, 1);
    return true;
  }

  async createFolder(userId: string, name: string, path: string = '/'): Promise<Folder> {
    const folder: Folder = {
      id: this.generateId(),
      name,
      path: `${path}${name}/`,
      userId,
      createdAt: new Date()
    };

    const userFolders = this.folders.get(userId) || [];
    userFolders.push(folder);
    this.folders.set(userId, userFolders);

    return folder;
  }

  async getFolders(userId: string): Promise<Folder[]> {
    return this.folders.get(userId) || [];
  }

  async deleteFolder(userId: string, folderId: string): Promise<boolean> {
    const userFolders = this.folders.get(userId) || [];
    const index = userFolders.findIndex(f => f.id === folderId);
    
    if (index === -1) return false;

    userFolders.splice(index, 1);
    return true;
  }

  async searchFiles(userId: string, query: string): Promise<FileMetadata[]> {
    const userFiles = this.files.get(userId) || [];
    const lowerQuery = query.toLowerCase();

    return userFiles.filter(file =>
      file.originalName.toLowerCase().includes(lowerQuery) ||
      file.filename.toLowerCase().includes(lowerQuery) ||
      file.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getFilesByType(userId: string, mimeType: string): Promise<FileMetadata[]> {
    const userFiles = this.files.get(userId) || [];
    return userFiles.filter(f => f.mimeType.startsWith(mimeType));
  }

  async getStorageUsage(userId: string): Promise<{ count: number; size: number }> {
    const userFiles = this.files.get(userId) || [];
    return {
      count: userFiles.length,
      size: userFiles.reduce((total, file) => total + file.size, 0)
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const fileManager = new FileManager();