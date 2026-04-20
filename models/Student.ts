import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IStudent extends Document {
  studentId: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Student || model<IStudent>("Student", StudentSchema);
