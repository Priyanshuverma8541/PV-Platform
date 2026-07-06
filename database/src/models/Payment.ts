import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: [true, 'Invoice ID is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  method: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cash', 'other'],
    required: [true, 'Payment method is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    trim: true,
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required'],
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

// Indexes
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ userId: 1, paymentDate: -1 });
PaymentSchema.index({ invoiceId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);