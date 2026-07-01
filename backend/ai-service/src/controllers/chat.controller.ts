import type { Response, NextFunction } from 'express';
import { routeAIRequest } from '../services/aiRouter.service.js';
import { buildPrompt } from '../services/prompt.service.js';
import { AIChat } from '../utils/models.js';
import type { AuthenticatedRequest } from '../types/index.js';
import crypto from 'crypto';

export async function chat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { message, sessionId } = req.body as { message: string; sessionId?: string };

    if (!message?.trim()) {
      return res.status(400).json({ message: 'message is required.' });
    }

    const { userPrompt, systemPrompt } = buildPrompt({
      feature: 'chat',
      data: { message },
    });

    const result = await routeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      userId: req.user?.userId,
      feature: 'chat',
    });

    // Persist to chat history
    const sid = sessionId ?? crypto.randomUUID();
    if (req.user?.userId) {
      AIChat.findOneAndUpdate(
        { userId: req.user.userId, sessionId: sid, feature: 'chat' },
        {
          $push: {
            messages: [
              { role: 'user', content: message },
              { role: 'assistant', content: result.content },
            ],
          },
          $set: { provider: result.provider, model: result.model },
        },
        { upsert: true }
      ).catch(() => {}); // fire and forget
    }

    res.json({
      content: result.content,
      sessionId: sid,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    next(error);
  }
}

export async function getChatHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.userId;

    const chat = await AIChat.findOne({ userId, sessionId, feature: 'chat' });
    if (!chat) return res.status(404).json({ message: 'Session not found.' });

    res.json({ messages: chat.messages, sessionId });
  } catch (error) {
    next(error);
  }
}
