import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['high', 'medium', 'low'],
        message: '{VALUE} is not a supported priority (high, medium, low)',
      },
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: String, // Stored as ISO string or YYYY-MM-DD to preserve local timezone precision
      required: false,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Work',
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.user ? ret.user.toString() : undefined;
        delete ret._id;
        delete ret.user;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Task = mongoose.model('Task', taskSchema);
