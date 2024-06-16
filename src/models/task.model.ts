import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ITask extends Document {
    _id: string
    title: string
    description: string
    category: string
    dueDate: Date
    reminder: Date
    isImportant: boolean
    userId: IUser['_id']
    createdAt: Date
    updatedAt: Date
}

enum Categories {
    WORK = 'work',
    FAMILY = 'family',
}

const TaskSchema: Schema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: Object.values(Categories) },
    dueDate: { type: Date, required: true },
    reminder: { type: Date, required: false },
    isImportant: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  // Create and export User model
  const Task = mongoose.model<ITask>('Task', TaskSchema);
  export default Task;