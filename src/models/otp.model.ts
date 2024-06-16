import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IOTP extends Document {
    _id: string
    otpToken: string
    purpose: string
    userId: IUser['_id']
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}

enum OTPPurpose {
    PASSWORD = 'password'
}

const OTPSchema: Schema = new Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    otpToken: { type: String, required: true },
    purpose: { type: String, enum: Object.values(OTPPurpose), required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  // Create and export User model
  const OTP = mongoose.model<IOTP>('OTP', OTPSchema);
  export default OTP;