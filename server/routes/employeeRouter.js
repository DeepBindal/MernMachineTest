import express from "express";
import { asyncHandler } from "../utils/WrapAsync.js";
import { createEmployee, deleteEmployee, getEmployees, getSingleEmployee, updateEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.route("/create-employee").post(asyncHandler(createEmployee));
router.route("/getEmployees/:userId").get(asyncHandler(getEmployees))
router.route("/update-employee/:employeeId").put(asyncHandler(updateEmployee));
router.route("/employee/:id").get(asyncHandler(getSingleEmployee));
router.route("/employee/delete/:id").delete(asyncHandler(deleteEmployee));

export default router;