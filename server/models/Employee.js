import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNo: {
    type: String,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    enum: ['HR', 'Manager', 'Sales'], // Dropdown options
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'], // Radio button options for Male and Female
    required: true,
  },
  course: {
    type: String, // This will store an array for checkbox options
    enum: ['MCA', 'BCA', 'BSC'], // Checkbox options for courses
    required: true,
  },
  image: {
    type: String, // This will store the path or URL to the uploaded file
    required: true,
  },
  firmManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
