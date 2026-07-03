/**
 * Search Engine - Global search across all platform data
 * Provides unified search across Projects, Portfolio, Career, CRM, Learning, etc.
 */

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  url: string;
  metadata: Record<string, any>;
  score: number;
}

export interface SearchFilters {
  types?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  userId?: string;
  tags?: string[];
}

export interface SearchIndex {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  url: string;
  userId: string;
  tags: string[];
  metadata: Record<string, any>;
  indexedAt: Date;
}

export class SearchEngine {
  private indexes: Map<string, SearchIndex> = new Map();
  private indexesByType: Map<string, Set<string>> = new Map();

  /**
   * Index a document for search
   */
  index(document: Omit<SearchIndex, 'id' | 'indexedAt'>): SearchIndex {
    const index: SearchIndex = {
      ...document,
      id: this.generateId(),
      indexedAt: new Date()
    };

    this.indexes.set(index.id, index);

    // Add to type index
    const typeIndex = this.indexesByType.get(index.type) || new Set();
    typeIndex.add(index.id);
    this.indexesByType.set(index.type, typeIndex);

    return index;
  }

  /**
   * Bulk index documents
   */
  bulkIndex(documents: Omit<SearchIndex, 'id' | 'indexedAt'>[]): SearchIndex[] {
    return documents.map(doc => this.index(doc));
  }

  /**
   * Remove document from search index
   */
  removeIndex(id: string): boolean {
    const index = this.indexes.get(id);
    
    if (!index) return false;

    // Remove from type index
    const typeIndex = this.indexesByType.get(index.type);
    if (typeIndex) {
      typeIndex.delete(id);
    }

    this.indexes.delete(id);
    return true;
  }

  /**
   * Search across all indexed documents
   */
  search(query: string, filters?: SearchFilters, limit: number = 50): SearchResult[] {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);

    let results: SearchResult[] = [];

    // Get candidate indexes
    let candidateIds: Set<string> | undefined;

    if (filters?.types && filters.types.length > 0) {
      // Search only in specified types
      candidateIds = new Set();
      filters.types.forEach(type => {
        const typeIndex = this.indexesByType.get(type);
        if (typeIndex) {
          typeIndex.forEach(id => candidateIds!.add(id));
        }
      });
    }

    // Score and filter documents
    for (const [id, index] of this.indexes.entries()) {
      // Apply type filter
      if (candidateIds && !candidateIds.has(id)) {
        continue;
      }

      // Apply user filter
      if (filters?.userId && index.userId !== filters.userId) {
        continue;
      }

      // Apply tag filter
      if (filters?.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => index.tags.includes(tag));
        if (!hasTag) continue;
      }

      // Calculate relevance score
      const score = this.calculateScore(index, queryTerms);

      if (score > 0) {
        results.push({
          id: index.id,
          type: index.type,
          title: index.title,
          description: index.description,
          url: index.url,
          metadata: index.metadata,
          score
        });
      }
    }

    // Sort by score (descending) and limit
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  /**
   * Calculate relevance score for a document
   */
  private calculateScore(index: SearchIndex, queryTerms: string[]): number {
    const searchText = `${index.title} ${index.description} ${index.content}`.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      // Title matches are worth more
      if (index.title.toLowerCase().includes(term)) {
        score += 10;
      }

      // Description matches
      if (index.description.toLowerCase().includes(term)) {
        score += 5;
      }

      // Content matches
      const contentMatches = (searchText.match(new RegExp(term, 'g')) || []).length;
      score += contentMatches;

      // Tag matches
      if (index.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 3;
      }
    }

    return score;
  }

  /**
   * Get suggestions for autocomplete
   */
  suggest(query: string, limit: number = 10): string[] {
    const queryLower = query.toLowerCase();
    const suggestions: Map<string, number> = new Map();

    for (const index of this.indexes.values()) {
      // Check title
      if (index.title.toLowerCase().includes(queryLower)) {
        suggestions.set(index.title, (suggestions.get(index.title) || 0) + 10);
      }

      // Check tags
      index.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.set(tag, (suggestions.get(tag) || 0) + 5);
        }
      });
    }

    // Sort by frequency and return top suggestions
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([suggestion]) => suggestion);
  }

  /**
   * Get indexed document by ID
   */
  getIndex(id: string): SearchIndex | undefined {
    return this.indexes.get(id);
  }

  /**
   * Get all indexes of a specific type
   */
  getIndexesByType(type: string): SearchIndex[] {
    const typeIndex = this.indexesByType.get(type);
    
    if (!typeIndex) return [];

    return Array.from(typeIndex)
      .map(id => this.indexes.get(id))
      .filter((index): index is SearchIndex => index !== undefined);
  }

  /**
   * Clear all indexes
   */
  clear(): void {
    this.indexes.clear();
    this.indexesByType.clear();
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalIndexes: number;
    indexesByType: Record<string, number>;
  } {
    const indexesByType: Record<string, number> = {};

    for (const [type, ids] of this.indexesByType.entries()) {
      indexesByType[type] = ids.size;
    }

    return {
      totalIndexes: this.indexes.size,
      indexesByType
    };
  }

  private generateId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global search engine instance
export const searchEngine = new SearchEngine();