import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
}

enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

const UserSchema: Schema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: Object.values(UserRole), default: UserRole.USER},
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  // Create and export User model
  const User = mongoose.model<IUser>('User', UserSchema);
  export default User;