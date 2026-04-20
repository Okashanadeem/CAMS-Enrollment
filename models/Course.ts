import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICourse extends Document {
  courseCode: string;
  courseTitle: string;
  courseType: "Theory" | "Lab";
  teacherEmail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
    },
    courseTitle: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    courseType: {
      type: String,
      enum: ["Theory", "Lab"],
      default: "Theory",
    },
    teacherEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
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

// Unique index for the combination of code and type
CourseSchema.index({ courseCode: 1, courseType: 1 }, { unique: true });

export default models.Course || model<ICourse>("Course", CourseSchema);
