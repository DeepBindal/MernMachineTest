import {
    Button,
    InputLabel,
    TextField,
    Checkbox,
    FormControlLabel,
  } from "@mui/material";
  import axios from "axios";
  import React, { useContext, useEffect, useState } from "react";
  import Dropzone from "react-dropzone";
  import { Context } from "../main";
  import { useNavigate, useParams } from "react-router-dom";
  import toast from "react-hot-toast";
  
  function UpdateEmployee() {
    const params = useParams();
    const { user, isAuthenticated } = useContext(Context);
    const navigate = useNavigate();
  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [designation, setDesignation] = useState("");
    const [gender, setGender] = useState("");
    const [course, setCourse] = useState([]);
    const [image, setImage] = useState([]);
    const [hasImageChanged, setHasImageChanged] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [employee, setEmployee] = useState({});
  
    useEffect(() => {
      async function getData() {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/employee/${params.employeeId}`
        );
        const fetchedEmployee = response.data;
        setEmployee(fetchedEmployee);
        setName(fetchedEmployee.name);
        setEmail(fetchedEmployee.email);
        setMobileNo(fetchedEmployee.mobileNo);
        setDesignation(fetchedEmployee.designation);
        setGender(fetchedEmployee.gender);
        setCourse(fetchedEmployee.course);
        // setImage([fetchedEmployee.image]); // Set the current image
      }
      getData();
    }, [params.employeeId]);
  
    useEffect(() => {
      if (!isAuthenticated) navigate("/login");
    }, [isAuthenticated, navigate]);
  
    const handleDrop = (files) => {
      const uploaders = files.map(async (file) => {
        setUploading(true);
        setHasImageChanged(true);
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
          setImage([data.url]); // Replace the image with the new one
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
          {image.length !== 0 &&
            image.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt="img" height={50} width={50} />
            ))}
        </div>
      );
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      let employeeData = {
        name,
        email,
        mobileNo,
        designation,
        gender,
        course: course[course.length-1],
        managerId: user.user.id,
      };
  
      if (hasImageChanged) {
        employeeData.image = image[0];
      } else {
        employeeData.image = employee.image;
      }
      console.log(employeeData)
  
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-employee/${params.employeeId}`,
          employeeData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const res = response.data;
        if (res.message === "EmployeeUpdated") {
          toast.success("Employee updated");
          return navigate("/employees");
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    };
  
    const handleCheckboxChange = (setState, value) => {
      setState((prev) => (prev === value ? "" : value));
    };
  
    const handleMultiSelectChange = (selectedValue) => {
      setCourse((prev) =>
        prev.includes(selectedValue)
          ? prev.filter((value) => value !== selectedValue)
          : [...prev, selectedValue]
      );
    };
  
    return (
      <div className="flex flex-col items-center mb-10 mx-5">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Update Employee</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <TextField
            label="Name"
            variant="outlined"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
  
          {/* Email Field */}
          <TextField
            label="Email"
            variant="outlined"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
  
          {/* Mobile No Field */}
          <TextField
            label="Mobile No"
            variant="outlined"
            id="mobileNo"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            fullWidth
          />
  
          {/* Designation Field */}
          <InputLabel>Designation</InputLabel>
          <div className="flex gap-4">
            {["HR", "Manager", "Sales"].map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={designation === d}
                    onChange={() => handleCheckboxChange(setDesignation, d)}
                  />
                }
                label={d}
              />
            ))}
          </div>
  
          {/* Gender Field */}
          <InputLabel>Gender</InputLabel>
          <div className="flex gap-4">
            {["Male", "Female"].map((g) => (
              <FormControlLabel
                key={g}
                control={
                  <Checkbox
                    checked={gender === g}
                    onChange={() => handleCheckboxChange(setGender, g)}
                  />
                }
                label={g}
              />
            ))}
          </div>
  
          {/* Courses Field */}
          <InputLabel>Courses</InputLabel>
          <div className="flex gap-4">
            {["BCA", "MCA", "BSC"].map((c) => (
              <FormControlLabel
                key={c}
                control={
                  <Checkbox
                    checked={course.includes(c)}
                    onChange={() => handleMultiSelectChange(c)}
                  />
                }
                label={c}
              />
            ))}
          </div>
  
          {/* Image Upload Field */}
          <p>Profile Image</p>
          {!hasImageChanged  && (
            <img
              src={employee.image}
              width={50}
              height={50}
              className="mb-4 rounded-lg"
              alt="employee"
            />
          )}
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
  
  export default UpdateEmployee;
