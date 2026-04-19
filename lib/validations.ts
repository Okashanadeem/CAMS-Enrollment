import { z } from "zod";

export const registrationSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID (Roll Number) is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid characters in Student ID")
    .trim()
    .toUpperCase(),
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9-]+$/, "Invalid phone number format")
    .trim(),
  enrolledCourses: z
    .array(
      z.object({
        courseCode: z.string(),
        courseTitle: z.string(),
        courseType: z.string(),
      })
    )
    .min(1, "Select at least one course"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
