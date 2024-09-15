import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";

function ShowEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { isAuthenticated, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getEmployees/${user.user.id}`
        );
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    getData();
  }, [user.user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const handleDelete = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/delete/${id}`
      );

      if (response.data.message == "Deleted") {
        const filteredEmployees = employees.filter(
          (employee) => employee._id !== id
        );
        setEmployees(filteredEmployees);
        toast("Employee data deleted.");
      } else {
        toast.error("Problem deleting employee.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Employees List</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  {/* <TableCell>{employee.id}</TableCell> */}
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <img
                      src={employee.image}
                      alt="img"
                      height={40}
                      width={40}
                    />
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.mobileNo}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.course}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/employee/update/${employee._id}`}>
                      <Button variant="contained">Edit</Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(employee._id)}
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShowEmployees;
