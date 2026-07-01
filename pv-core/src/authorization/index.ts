export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
  scope: 'global' | 'organization' | 'project';
  scopeId?: string;
}

export class AuthorizationService {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, UserRole[]> = new Map();

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const newRole: Role = {
      ...role,
      id: this.generateId()
    };
    this.roles.set(newRole.id, newRole);
    return newRole;
  }

  async assignRole(userId: string, roleId: string, scope: 'global' | 'organization' | 'project', scopeId?: string): Promise<void> {
    const userRoles = this.userRoles.get(userId) || [];
    userRoles.push({ userId, roleId, scope, scopeId });
    this.userRoles.set(userId, userRoles);
  }

  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const userRoles = this.userRoles.get(userId) || [];
    
    for (const userRole of userRoles) {
      const role = this.roles.get(userRole.roleId);
      if (!role) continue;

      const hasPermission = role.permissions.some(perm => 
        perm === `${resource}:${action}` || perm === `${resource}:*` || perm === '*:*'
      );

      if (hasPermission) return true;
    }

    return false;
  }

  async getPermissions(userId: string): Promise<string[]> {
    const userRoles = this.userRoles.get(userId) || [];
    const permissions: Set<string> = new Set();

    for (const userRole of userRoles) {
      const role = this.roles.get(userRole.roleId);
      if (role) {
        role.permissions.forEach(perm => permissions.add(perm));
      }
    }

    return Array.from(permissions);
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    const userRoles = this.userRoles.get(userId) || [];
    const filtered = userRoles.filter(ur => ur.roleId !== roleId);
    this.userRoles.set(userId, filtered);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const authzService = new AuthorizationService();