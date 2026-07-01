export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface UserTheme {
  userId: string;
  themeId: string;
  customizations?: Partial<Theme>;
}

export class ThemeEngine {
  private themes: Map<string, Theme> = new Map();
  private userThemes: Map<string, UserTheme> = new Map();

  constructor() {
    // Register default themes
    this.registerDefaultThemes();
  }

  async registerTheme(theme: Omit<Theme, 'id'>): Promise<Theme> {
    const newTheme: Theme = {
      ...theme,
      id: this.generateId()
    };
    this.themes.set(newTheme.id, newTheme);
    return newTheme;
  }

  async getTheme(id: string): Promise<Theme | null> {
    return this.themes.get(id) || null;
  }

  async getThemes(): Promise<Theme[]> {
    return Array.from(this.themes.values());
  }

  async getDefaultTheme(mode: 'light' | 'dark'): Promise<Theme | null> {
    return Array.from(this.themes.values()).find(t => t.mode === mode && t.name === 'Default') || null;
  }

  async setUserTheme(userId: string, themeId: string, customizations?: Partial<Theme>): Promise<UserTheme> {
    const userTheme: UserTheme = {
      userId,
      themeId,
      customizations
    };
    this.userThemes.set(userId, userTheme);
    return userTheme;
  }

  async getUserTheme(userId: string): Promise<UserTheme | null> {
    return this.userThemes.get(userId) || null;
  }

  async getActiveTheme(userId: string): Promise<Theme | null> {
    const userTheme = this.userThemes.get(userId);
    if (!userTheme) {
      return this.getDefaultTheme('light');
    }

    const baseTheme = await this.getTheme(userTheme.themeId);
    if (!baseTheme) return this.getDefaultTheme('light');

    if (userTheme.customizations) {
      return this.mergeThemes(baseTheme, userTheme.customizations);
    }

    return baseTheme;
  }

  async updateTheme(id: string, updates: Partial<Theme>): Promise<Theme | null> {
    const theme = this.themes.get(id);
    if (!theme) return null;

    const updatedTheme = { ...theme, ...updates, id };
    this.themes.set(id, updatedTheme);
    return updatedTheme;
  }

  async deleteTheme(id: string): Promise<boolean> {
    return this.themes.delete(id);
  }

  private mergeThemes(base: Theme, custom: Partial<Theme>): Theme {
    return {
      ...base,
      ...custom,
      colors: { ...base.colors, ...custom.colors },
      typography: { ...base.typography, ...custom.typography },
      spacing: { ...base.spacing, ...custom.spacing }
    };
  }

  private registerDefaultThemes(): void {
    // Light theme
    const lightTheme: Theme = {
      id: 'light-default',
      name: 'Default',
      mode: 'light',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    };

    // Dark theme
    const darkTheme: Theme = {
      ...lightTheme,
      id: 'dark-default',
      name: 'Default',
      mode: 'dark',
      colors: {
        primary: '#60A5FA',
        secondary: '#34D399',
        accent: '#A78BFA',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        border: '#374151',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24'
      }
    };

    this.themes.set(lightTheme.id, lightTheme);
    this.themes.set(darkTheme.id, darkTheme);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const themeEngine = new ThemeEngine();