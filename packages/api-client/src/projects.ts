import apiClient from './client';

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  techStack: string[];
  urls: {
    github?: string;
    live?: string;
    vercel?: string;
  };
  status: 'active' | 'archived' | 'deployed';
  settings: {
    public: boolean;
    featured: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  techStack?: string[];
  urls?: {
    github?: string;
    live?: string;
    vercel?: string;
  };
  status?: 'active' | 'archived' | 'deployed';
  settings?: {
    public?: boolean;
    featured?: boolean;
  };
}

// Get all projects for current user
export const getProjects = async (filters?: {
  status?: string;
  featured?: boolean;
}): Promise<{ success: boolean; count: number; data: Project[] }> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
  
  const response = await apiClient.get(`/projects?${params.toString()}`);
  return response.data;
};

// Get single project
export const getProject = async (id: string): Promise<{ success: boolean; data: Project }> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

// Create project
export const createProject = async (data: CreateProjectData): Promise<{ success: boolean; message: string; data: Project }> => {
  const response = await apiClient.post('/projects', data);
  return response.data;
};

// Update project
export const updateProject = async (
  id: string,
  data: Partial<CreateProjectData>
): Promise<{ success: boolean; message: string; data: Project }> => {
  const response = await apiClient.put(`/projects/${id}`, data);
  return response.data;
};

// Delete project
export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};