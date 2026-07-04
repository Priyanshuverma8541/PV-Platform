import mongoose, { Schema } from 'mongoose';
import type { AIFeature } from '../types/index';

/* ── ai_usage ── tracks every call for Mission Control analytics ── */
const aiUsageSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    feature: { type: String, required: true },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    durationMs: { type: Number, default: 0 },
    success: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'ai_usage' }
);

export const AIUsage = mongoose.model('AIUsage', aiUsageSchema);

/* ── ai_chats ── full conversation history per user per feature ── */
const aiChatSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    feature: { type: String, required: true },
    sessionId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    provider: String,
    model: String,
  },
  { timestamps: true, collection: 'ai_chats' }
);

export const AIChat = mongoose.model('AIChat', aiChatSchema);

/* ── ai_feedback ── thumbs up/down for future fine-tuning ── */
const aiFeedbackSchema = new Schema(
  {
    userId: { type: String, required: true },
    feature: { type: String as unknown as AIFeature },
    sessionId: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true, collection: 'ai_feedback' }
);

export const AIFeedback = mongoose.model('AIFeedback', aiFeedbackSchema);
