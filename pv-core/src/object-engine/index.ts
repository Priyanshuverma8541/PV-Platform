export interface ObjectField {
  name: string;
  displayName: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'multiselect' | 'file' | 'relationship';
  required: boolean;
  unique: boolean;
  default?: any;
  options?: any[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

export interface ObjectRelationship {
  name: string;
  displayName: string;
  referenceTo: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface ObjectPermissions {
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}

export interface ObjectType {
  id: string;
  name: string;
  displayName: string;
  plural: string;
  description: string;
  icon: string;
  fields: ObjectField[];
  relationships: ObjectRelationship[];
  permissions: ObjectPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomObject {
  _id?: string;
  objectType: string;
  [key: string]: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata: {
    version: number;
    tags: string[];
  };
}

export class ObjectEngine {
  private objectTypes: Map<string, ObjectType> = new Map();
  private objects: Map<string, CustomObject[]> = new Map();

  async defineObjectType(objectType: Omit<ObjectType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ObjectType> {
    const newType: ObjectType = {
      ...objectType,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.objectTypes.set(newType.id, newType);
    this.objects.set(newType.id, []);
    return newType;
  }

  async getObjectTypes(): Promise<ObjectType[]> {
    return Array.from(this.objectTypes.values());
  }

  async getObjectType(id: string): Promise<ObjectType | null> {
    return this.objectTypes.get(id) || null;
  }

  async getObjectTypeByName(name: string): Promise<ObjectType | null> {
    return Array.from(this.objectTypes.values()).find(type => type.name === name) || null;
  }

  async createObject(objectTypeId: string, data: Partial<CustomObject>, userId: string): Promise<CustomObject> {
    const objectType = this.objectTypes.get(objectTypeId);
    if (!objectType) {
      throw new Error(`Object type ${objectTypeId} not found`);
    }

    const newObject: CustomObject = {
      ...data,
      _id: this.generateId(),
      objectType: objectType.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      metadata: {
        version: 1,
        tags: []
      }
    };

    const objects = this.objects.get(objectTypeId) || [];
    objects.push(newObject);
    this.objects.set(objectTypeId, objects);

    return newObject;
  }

  async getObjects(objectTypeId: string, filters?: Record<string, any>): Promise<CustomObject[]> {
    let objects = this.objects.get(objectTypeId) || [];
    
    if (filters) {
      objects = objects.filter(obj => {
        return Object.entries(filters).every(([key, value]) => obj[key] === value);
      });
    }

    return objects;
  }

  async getObject(objectTypeId: string, objectId: string): Promise<CustomObject | null> {
    const objects = this.objects.get(objectTypeId) || [];
    return objects.find(obj => obj._id === objectId) || null;
  }

  async updateObject(objectTypeId: string, objectId: string, data: Partial<CustomObject>): Promise<CustomObject | null> {
    const objects = this.objects.get(objectTypeId) || [];
    const index = objects.findIndex(obj => obj._id === objectId);
    
    if (index === -1) return null;

    objects[index] = {
      ...objects[index],
      ...data,
      _id: objectId,
      updatedAt: new Date(),
      metadata: {
        ...objects[index].metadata,
        version: objects[index].metadata.version + 1
      }
    };

    return objects[index];
  }

  async deleteObject(objectTypeId: string, objectId: string): Promise<boolean> {
    const objects = this.objects.get(objectTypeId) || [];
    const index = objects.findIndex(obj => obj._id === objectId);
    
    if (index === -1) return false;

    objects.splice(index, 1);
    return true;
  }

  async searchObjects(query: string, objectTypeIds?: string[]): Promise<CustomObject[]> {
    const results: CustomObject[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [objectTypeId, objects] of this.objects.entries()) {
      if (objectTypeIds && !objectTypeIds.includes(objectTypeId)) continue;

      const matches = objects.filter(obj => 
        Object.values(obj).some(value => 
          String(value).toLowerCase().includes(lowerQuery)
        )
      );

      results.push(...matches);
    }

    return results;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const objectEngine = new ObjectEngine();