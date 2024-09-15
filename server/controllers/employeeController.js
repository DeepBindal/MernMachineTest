import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { connectToDb } from "../utils/db.js";
import ExpressError from "../utils/ExpressError.js";
import { employeeSchema } from "../utils/vaidation.js";

export const createEmployee = async (req, res) => {
  await connectToDb();

  const {
    name,
    email,
    mobileNo,
    designation,
    gender,
    course,
    image,
    managerId,
  } = req.body;

  // Validate the input data using zod schema
  const result = employeeSchema.safeParse({ name, email, mobileNo });

  // Check if validation failed
  if (!result.success) {
    // Create a combined string of all error messages
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");

    // Return the combined error message
    return res.json({ message: `Validation failed: ${errorMessage}` });
  }

  // Check if employee already exists
  const existEmployee = await Employee.findOne({ email: email });
  if (existEmployee) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Create new employee record
  const employee = new Employee({
    name,
    email,
    mobileNo,
    designation,
    gender,
    course,
    image,
    firmManager: managerId,
  });

  // Save the employee to the database
  await employee.save();

  // Return success message if everything is good
  return res.status(201).json({ message: "EmployeeSaved" });
};

export const getEmployees = async (req, res) => {
  await connectToDb();
  const { userId } = req.params;
  const employees = await Employee.find({ firmManager: userId });
  return res.status(200).json({ employees });
};

export const updateEmployee = async (req, res) => {
  await connectToDb();
  const { employeeId } = req.params;
  const {
    name,
    email,
    mobileNo,
    designation,
    gender,
    course,
    image,
    managerId,
  } = req.body;
  const employee = await Employee.findByIdAndUpdate(
    employeeId,
    {
      $set: {
        name,
        email,
        mobileNo,
        designation,
        gender,
        course,
        image,
        managerId,
      },
    },
    { new: true }
  );

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.json({ message: "EmployeeUpdated" });
};

export const deleteEmployee = async (req, res) => {
  await connectToDb();
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);

  res.json({ message: "Deleted" });
};

export const getSingleEmployee = async (req, res) => {
  await connectToDb();
  const { id } = req.params;
  const employee = await Employee.findById(id);

  return res.status(200).json(employee);
};
