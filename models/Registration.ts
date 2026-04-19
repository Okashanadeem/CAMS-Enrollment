import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IRegistration extends Document {
  studentId: string; // Roll Number
  name: string;
  email: string;
  phone: string;
  enrolledCourses: {
    courseCode: string;
    courseTitle: string;
    courseType: string;
  }[];
  submittedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID (Roll Number) is required"],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
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
      required: [true, "Phone number is required"],
      trim: true,
    },
    enrolledCourses: [
      {
        courseCode: String,
        courseTitle: String,
        courseType: String,
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registration for the same studentId in a semester/session
// (For now, we'll just index studentId)
RegistrationSchema.index({ studentId: 1 }, { unique: true });

export default models.Registration || model<IRegistration>("Registration", RegistrationSchema);
