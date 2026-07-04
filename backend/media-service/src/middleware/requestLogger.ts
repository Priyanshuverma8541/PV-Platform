import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { eventBus, EventTypes } from 'pv-core';
import logger from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  try {
    const requestId = uuidv4();
    (req as any).requestId = requestId;

    const startTime = Date.now();

    logger.debug('Incoming request', {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip
    });

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      logger.info('Request completed', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });

      // Track analytics
      eventBus.emit({
        type: EventTypes.ANALYTICS_TRACKED,
        payload: {
          event: 'api_request',
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          duration
        },
        metadata: {
          source: 'media-service',
          correlationId: requestId
        }
      }).catch(err => logger.warn('Failed to emit analytics event', { error: err }));
    });

    next();
  } catch (error) {
    next(error);
  }
}