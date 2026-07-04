export { apiClient } from './client.js';
export { register, login, getCurrentUser, verifyEmail, forgotPassword, resetPassword } from './auth.js';
export type { User, AuthResponse } from './auth.js';
export { getProjects, getProject, createProject, updateProject, deleteProject } from './projects.js';
export type { Project, CreateProjectData } from './projects.js';
