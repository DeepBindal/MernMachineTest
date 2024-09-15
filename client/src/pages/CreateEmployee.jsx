import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "../validations";

function CreateEmployee() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // formState: { errors },
  } = useForm({
    // resolver: zodResolver(employeeSchema),
  });
  const { user, isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrop = (files) => {
    const uploaders = files.map(async (file) => {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dnwxccz0p/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        );
        const data = response.data;
        setImage((prevImages) => [...prevImages, data.url]);
        setUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploading(false);
      }
    });
    axios.all(uploaders);
  };

  const imagePreview = () => {
    return uploading ? (
      <h3>Uploading...</h3>
    ) : (
      <div className="flex gap-4">
        {image.length === 0 ? (
          <h3>No Image</h3>
        ) : (
          image.map((imgUrl, index) => (
            <img key={index} src={imgUrl} alt="img" height={50} width={50} />
          ))
        )}
      </div>
    );
  };

  const onSubmit = async (data) => {
    const employeeData = {
      name: data.name,
      email: data.email,
      mobileNo: data.mobileNo,
      designation: data.designation,
      gender: data.gender[0],
      course: data.course[0],
      image: image[0],
      managerId: user.user.id,
    };
    console.log(employeeData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-employee`,
        employeeData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const res = response.data;
      if (res.message === "EmployeeSaved") {
        toast.success("Employee added");
        return navigate("/");
      } else {
        // console.log(res)
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10 mx-5">
      <h1 className="text-3xl font-bold text-blue-400">Add an employee</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name Field */}
        <TextField
          label="Name"
          variant="outlined"
          id="name"
          {...register("name")}
          fullWidth
        />

        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          id="email"
          {...register("email")}
          fullWidth
        />

        {/* Mobile No Field */}
        <TextField
          label="Mobile No"
          variant="outlined"
          id="mobileNo"
          {...register("mobileNo")}
          fullWidth
        />

        {/* Designation Field */}
        <InputLabel id="designation-label">Designation</InputLabel>
        <Select
          labelId="designation-label"
          id="designation"
          defaultValue=""
          {...register("designation")}
          fullWidth
        >
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
        </Select>

        {/* Gender Field */}
        <InputLabel>Gender</InputLabel>
        <div className="flex gap-4">
          <FormControlLabel
            control={<Checkbox {...register("gender")} value="Male" />}
            label="Male"
          />
          <FormControlLabel
            control={<Checkbox {...register("gender")} value="Female" />}
            label="Female"
          />
        </div>

        {/* Courses Field */}
        <InputLabel>Courses</InputLabel>
        <div className="flex gap-4">
          <FormControlLabel
            control={<Checkbox {...register("course")} value="BCA" />}
            label="BCA"
          />
          <FormControlLabel
            control={<Checkbox {...register("course")} value="MCA" />}
            label="MCA"
          />
          <FormControlLabel
            control={<Checkbox {...register("course")} value="BSC" />}
            label="BSC"
          />
        </div>

        {/* Image Upload Field */}
        <p>Profile Image</p>
        <Dropzone onDrop={handleDrop} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="bg-white hover:bg-gray-200 transition duration-300 ease-in-out p-6 w-full h-20 md:h-20 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-gray-500">
                Drag & drop your Profile Image here, or click to select files
              </p>
            </div>
          )}
        </Dropzone>
        {imagePreview()}

        {/* Submit Button */}
        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default CreateEmployee;
