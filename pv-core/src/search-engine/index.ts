export interface SearchResult {
  id: string;
  objectType: string;
  app: string;
  title: string;
  description: string;
  score: number;
  tags?: string[];
}

export interface SearchFilters {
  objectType?: string;
  app?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
}

export interface SearchResponse {
  total: number;
  results: SearchResult[];
  facets: Record<string, Record<string, number>>;
}

export class SearchEngine {
  private documents: Map<string, SearchResult[]> = new Map();

  async index(objectType: string, app: string, document: {
    id: string;
    title: string;
    description: string;
    tags?: string[];
  }): Promise<void> {
    const result: SearchResult = {
      id: document.id,
      objectType,
      app,
      title: document.title,
      description: document.description,
      score: 1.0,
      ...(document.tags && { tags: document.tags })
    };

    const key = `${app}:${objectType}`;
    const docs = this.documents.get(key) || [];
    docs.push(result);
    this.documents.set(key, docs);
  }

  async search(query: string, filters?: SearchFilters, limit: number = 20, offset: number = 0): Promise<SearchResponse> {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];
    const facets: Record<string, Record<string, number>> = {};

    for (const [key, documents] of this.documents.entries()) {
      const [app, objectType] = key.split(':');

      // Apply filters
      if (filters?.objectType && filters.objectType !== objectType) continue;
      if (filters?.app && filters.app !== app) continue;

      const matches = documents.filter(doc => {
        const matchesQuery = 
          doc.title.toLowerCase().includes(lowerQuery) ||
          doc.description.toLowerCase().includes(lowerQuery);

        if (!matchesQuery) return false;

        // Apply additional filters
        if (filters?.tags && filters.tags.length > 0) {
          const hasTag = filters.tags.some(tag => 
            doc.tags?.includes(tag)
          );
          if (!hasTag) return false;
        }

        return true;
      });

      results.push(...matches);

      // Update facets
      if (!facets[objectType]) {
        facets[objectType] = {};
      }
      facets[objectType][app] = (facets[objectType][app] || 0) + matches.length;
    }

    // Sort by score and apply pagination
    const sorted = results.sort((a, b) => b.score - a.score);
    const paginated = sorted.slice(offset, offset + limit);

    return {
      total: results.length,
      results: paginated,
      facets
    };
  }

  async removeFromIndex(objectType: string, app: string, id: string): Promise<void> {
    const key = `${app}:${objectType}`;
    const docs = this.documents.get(key) || [];
    const filtered = docs.filter(doc => doc.id !== id);
    this.documents.set(key, filtered);
  }

  async clearIndex(app?: string): Promise<void> {
    if (app) {
      for (const key of this.documents.keys()) {
        if (key.startsWith(`${app}:`)) {
          this.documents.delete(key);
        }
      }
    } else {
      this.documents.clear();
    }
  }
}

export const searchEngine = new SearchEngine();