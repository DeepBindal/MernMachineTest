import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "../validations/index";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });
  const saveUser = async (values) => {
    const requestBody = { ...values };
    try {
      // Set loading state to true if needed (e.g., update UI)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response
      const res = response.data;
      if(res.message == "USERSIGNEDUP"){
        toast.success("User Signed up");
        return navigate("/")
      }else{
        toast.error(res.message);
      }
      // console.log("User saved successfully:", res);

      // You can add additional logic here, e.g., redirect to another page or display a success message
    } catch (error) {
      // Handle errors here
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        // No response was received from the server
        console.error("Error request:", error.request);
      } else {
        // Something happened while setting up the request
        console.error("Error message:", error.message);
      }

      // Optionally update the UI with an error message or perform other actions
    } finally {
      // Reset loading state to false if needed
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 shadow-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto my-10 p-6 sm:p-8 md:p-10 rounded-lg">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-2 md:mb-4 text-gray-800">
        Welcome to Abc Corp
      </h1>
      <p className="text-center text-gray-600 mb-4 sm:mb-6 md:mb-8">
        Create an account for free today.
      </p>
      <form
        onSubmit={handleSubmit(saveUser)}
        className="flex flex-col items-center gap-6 w-full"
      >
        <TextField
          error={!!errors.email}
          id="email"
          label="Email"
          type="text"
          variant="outlined"
          fullWidth
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          error={!!errors.username}
          id="username"
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
          helperText={errors.username?.message}
          {...register("username")}
        />
        <TextField
          error={!!errors.password}
          helperText={errors.password?.message}
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          {...register("password")}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-2"
        >
          Signup
        </Button>
      </form>
    </div>
  );
}

export default Signup;
