export interface RouteConfig {
  path: string;
  target: string;
  methods: string[];
  rateLimit?: {
    windowMs: number;
    max: number;
  };
}

export interface GatewayConfig {
  routes?: RouteConfig[];
  defaultRateLimit?: {
    windowMs: number;
    max: number;
  };
}

export class APIGateway {
  private routes: Map<string, RouteConfig> = new Map();
  private config: Required<GatewayConfig>;

  constructor(config?: GatewayConfig) {
    this.config = {
      routes: config?.routes || [],
      defaultRateLimit: config?.defaultRateLimit || {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100
      }
    };
  }

  registerRoute(route: RouteConfig): void {
    this.routes.set(route.path, route);
  }

  getRoute(path: string): RouteConfig | undefined {
    return this.routes.get(path);
  }

  getAllRoutes(): RouteConfig[] {
    return Array.from(this.routes.values());
  }

  async route(path: string): Promise<{ target: string; method: string } | null> {
    const route = this.routes.get(path);
    if (!route) return null;

    return {
      target: route.target,
      method: route.methods[0] || 'GET'
    };
  }
}

export const apiGateway = new APIGateway();