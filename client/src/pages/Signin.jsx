import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, LoginSchema } from "../validations/index";
import { Context } from "../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signin() {
  const [loading, setLoading] = useState(false);
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const loginUser = async (values) => {
    console.log(values);
    const requestBody = { ...values };
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response
      const res = response.data;
      if (res.message === "LOGGED") {
        setIsAuthenticated(true);
        const obj = { user: res.user, token: res.token }; // Assuming token is part of the response
        setUser(obj);
        toast.success("Welcome back!");
        navigate("/"); // Navigate to home page
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("No response from the server.");
      } else {
        console.error("Error message:", error.message);
        toast.error("Request setup error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 shadow-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto my-10 p-6 sm:p-8 md:p-10 rounded-lg">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-2 md:mb-4 text-gray-800">
        Welcome back to Abc Corp
      </h1>
      <form
        onSubmit={handleSubmit(loginUser)}
        className="flex flex-col items-center gap-6 w-full"
      >
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
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default Signin;
