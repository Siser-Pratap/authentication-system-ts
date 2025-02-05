import { Schema, Document, Types, model, Model } from 'mongoose';

export interface Task extends Document {
  title: string;
  user: Types.ObjectId; 
}

export const TaskSchema = new Schema<Task>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  },
  { timestamps: true }
);

export const TaskModel: Model<Task> = model<Task>('Task', TaskSchema);


