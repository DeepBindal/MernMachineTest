import { z } from "zod";

export const employeeSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(100, { message: "Name cannot exceed 100 characters" })
      .nonempty({ message: "Name is required" }),
  
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .nonempty({ message: "Email is required" }),
  
    mobileNo: z
      .string()
      .regex(/^[0-9]{10}$/, { message: "Mobile number must be 10 digits" })
      .nonempty({ message: "Mobile number is required" }),
  });