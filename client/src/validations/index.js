import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(4, "Username must be atleast 4 characters")
    .max(45, "Username must be less than 45 characters")
    .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters ")
    .max(50, "Password must be less than 50 characters"),
});
export const LoginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be atleast 4 characters")
    .max(45, "Username must be less than 45 characters")
    .regex(new RegExp("^[a-zA-Z]+$"), "No special character allowed!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters ")
    .max(50, "Password must be less than 50 characters"),
});

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
