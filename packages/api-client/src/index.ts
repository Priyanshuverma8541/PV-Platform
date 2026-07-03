export { apiClient } from './client';
export { register, login, getCurrentUser, verifyEmail, forgotPassword, resetPassword } from './auth';
export type { User, AuthResponse } from './auth';
export { getProjects, getProject, createProject, updateProject, deleteProject } from './projects';
export type { Project, CreateProjectData } from './projects';