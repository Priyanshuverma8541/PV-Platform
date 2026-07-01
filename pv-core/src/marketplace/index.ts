export interface Extension {
  id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  price: number; // 0 for free
  manifest: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtensionInstallation {
  userId: string;
  extensionId: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
  installedAt: Date;
}

export interface ExtensionReview {
  id: string;
  userId: string;
  extensionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class Marketplace {
  private extensions: Map<string, Extension> = new Map();
  private installations: Map<string, ExtensionInstallation[]> = new Map();
  private reviews: Map<string, ExtensionReview[]> = new Map();

  async publishExtension(extension: Omit<Extension, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'rating'>): Promise<Extension> {
    const newExtension: Extension = {
      ...extension,
      id: this.generateId(),
      downloads: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.extensions.set(newExtension.id, newExtension);
    return newExtension;
  }

  async getExtensions(filters?: {
    category?: string;
    tags?: string[];
    minRating?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<Extension[]> {
    let results = Array.from(this.extensions.values());

    if (filters?.category) {
      results = results.filter(e => e.category === filters.category);
    }
    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter(e => filters.tags!.some(tag => e.tags.includes(tag)));
    }
    if (filters?.minRating) {
      results = results.filter(e => e.rating >= filters.minRating!);
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter(e => e.price <= filters.maxPrice!);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    return results.sort((a, b) => b.downloads - a.downloads);
  }

  async getExtension(id: string): Promise<Extension | null> {
    return this.extensions.get(id) || null;
  }

  async getExtensionBySlug(slug: string): Promise<Extension | null> {
    return Array.from(this.extensions.values()).find(e => e.slug === slug) || null;
  }

  async updateExtension(id: string, updates: Partial<Extension>): Promise<Extension | null> {
    const extension = this.extensions.get(id);
    if (!extension) return null;

    const updated = { ...extension, ...updates, id, updatedAt: new Date() };
    this.extensions.set(id, updated);
    return updated;
  }

  async uninstallExtension(userId: string, extensionId: string): Promise<boolean> {
    const installations = this.installations.get(userId) || [];
    const index = installations.findIndex(i => i.extensionId === extensionId);
    
    if (index === -1) return false;
    
    installations.splice(index, 1);
    return true;
  }

  async installExtension(userId: string, extensionId: string, version: string, config?: Record<string, any>): Promise<ExtensionInstallation> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    // Increment download count
    extension.downloads++;

    const installations = this.installations.get(userId) || [];
    
    const installation: ExtensionInstallation = {
      userId,
      extensionId,
      version,
      enabled: true,
      config: config || {},
      installedAt: new Date()
    };

    installations.push(installation);
    this.installations.set(userId, installations);

    return installation;
  }

  async getUserExtensions(userId: string): Promise<ExtensionInstallation[]> {
    return this.installations.get(userId) || [];
  }

  async isExtensionInstalled(userId: string, extensionId: string): Promise<boolean> {
    const installations = this.installations.get(userId) || [];
    return installations.some(i => i.extensionId === extensionId);
  }

  async toggleExtension(userId: string, extensionId: string, enabled: boolean): Promise<boolean> {
    const installations = this.installations.get(userId) || [];
    const installation = installations.find(i => i.extensionId === extensionId);
    
    if (!installation) return false;
    
    installation.enabled = enabled;
    return true;
  }

  async addReview(review: Omit<ExtensionReview, 'id' | 'createdAt'>): Promise<ExtensionReview> {
    const newReview: ExtensionReview = {
      ...review,
      id: this.generateId(),
      createdAt: new Date()
    };

    const extensionReviews = this.reviews.get(review.extensionId) || [];
    extensionReviews.push(newReview);
    this.reviews.set(review.extensionId, extensionReviews);

    // Update extension rating
    await this.updateExtensionRating(review.extensionId);

    return newReview;
  }

  async getReviews(extensionId: string): Promise<ExtensionReview[]> {
    return this.reviews.get(extensionId) || [];
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    for (const extension of this.extensions.values()) {
      categories.add(extension.category);
    }
    return Array.from(categories);
  }

  private async updateExtensionRating(extensionId: string): Promise<void> {
    const reviews = this.reviews.get(extensionId) || [];
    if (reviews.length === 0) return;

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const average = sum / reviews.length;

    const extension = this.extensions.get(extensionId);
    if (extension) {
      extension.rating = Math.round(average * 10) / 10;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const marketplace = new Marketplace();