import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  tax?: {
    rate: number;
    amount: number;
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  };
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required'],
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  paidDate: { type: Date },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  }],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: 0,
  },
  tax: {
    rate: { type: Number, min: 0, max: 100 },
    amount: { type: Number, min: 0 },
  },
  discount: {
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: { type: Number, min: 0 },
    amount: { type: Number, min: 0 },
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  terms: {
    type: String,
    maxlength: [2000, 'Terms cannot exceed 2000 characters'],
  },
}, {
  timestamps: true,
});

// Indexes
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ userId: 1, invoiceNumber: 1 });
InvoiceSchema.index({ userId: 1, dueDate: 1 });
InvoiceSchema.index({ userId: 1, createdAt: -1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);