import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Appbar from "./components/Appbar";
import Signin from "./pages/Signin";
import CreateEmployee from "./pages/CreateEmployee";
import ShowEmployees from "./pages/ShowEmployees";
import { Toaster } from "react-hot-toast";
import UpdateEmployee from "./pages/UpdateEmployee";
function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/employees" element={<ShowEmployees />} />
        <Route path="/employee/update/:employeeId" element={<UpdateEmployee />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
