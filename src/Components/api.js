import express from "express";
import helmet from "helmet";
import cors from "cors";
import ShortUniqueId from "short-unique-id";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); //add for it to work for for ES Modules
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
//
const employeesFilePath = path.join(__dirname, "../data/employees.json");

function readEmployeesFromFile() {
  const data = fs.readFileSync(employeesFilePath, "utf8");
  return JSON.parse(data).employees;
}

function getNextId(employees) {
  if (employees.length === 0) {
    return "001";
  }
  const maxId = employees.reduce((max, employee) => {
    const id = parseInt(employee.id, 10);
    return isNaN(id) ? max : Math.max(max, id);
  }, 0);
  return (maxId + 1).toString().padStart(3, "0");
}

function writeEmployeesToFile(employees) {
  fs.writeFileSync(employeesFilePath, JSON.stringify({ employees }, null, 2));
}

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Get request to read data
app.get("/directory", (req, res) => {
  const employees = readEmployeesFromFile();
  res.status(200).json({
    success: true,
    payload: employees,
  });
});

// POST request to add new employee
app.post("/directory", (req, res) => {
  const newEmployee = req.body.newEmployee || req.body;

  console.log("Received body:", req.body);

  if (!newEmployee || Object.keys(newEmployee).length === 0) {
    console.log("Error: Invalid or missing employee data");
    return res.status(400).json({
      error: true,
      message: "Invalid or missing employee data",
      data: null,
    });
  }

  const employees = readEmployeesFromFile();
  const nextId = getNextId(employees);
  console.log("Generated next ID:", nextId); // Add this line for debugging

  const addNewEmployee = {
    id: nextId,
    ...newEmployee,
  };

  employees.push(addNewEmployee);
  writeEmployeesToFile(employees);

  console.log("New employee added:", addNewEmployee); // Add this line for debugging

  res.status(201).json({
    success: true,
    payload: addNewEmployee,
  });
});

// Function for PUT request
function updateEmployeeById(requestId, updates) {
  const employees = readEmployeesFromFile();
  const index = employees.findIndex(({ id }) => id === requestId);

  if (index === -1) {
    return { success: false, data: null };
  }

  employees[index] = { ...employees[index], ...updates };
  writeEmployeesToFile(employees);
  return { success: true, data: employees[index] };
}

// PUT to update an existing employee
app.put("/directory/:id", (req, res) => {
  const updateEmployee = updateEmployeeById(req.params.id, req.body);

  if (!updateEmployee.success) {
    return res.status(400).json({
      error: true,
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    payload: updateEmployee.data,
  });
});

// Function for DELETE request
function deleteEmployeeById(requestId) {
  const employees = readEmployeesFromFile();
  const index = employees.findIndex(({ id }) => id === requestId);

  if (index === -1) {
    return { success: false, data: null };
  }

  const deleted = employees.splice(index, 1)[0];
  writeEmployeesToFile(employees);
  return { success: true, data: deleted };
}

// Delete existing employee with matching ID
app.delete("/directory/:id", (req, res) => {
  const deletedEmployee = deleteEmployeeById(req.params.id);

  if (!deletedEmployee.success) {
    return res.status(400).json({
      error: true,
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    payload: deletedEmployee.data,
  });
});

// PORT
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function normalizeEmployeeIds() {
  const employees = readEmployeesFromFile();
  let nextId = 1;
  const normalizedEmployees = employees.map((employee) => {
    const id = nextId.toString().padStart(3, "0");
    nextId++;
    return {
      ...employee,
      id: id,
    };
  });
  writeEmployeesToFile(normalizedEmployees);
  console.log("Employee IDs have been normalized.");
}

// Call this function once to normalize your existing data
// normalizeEmployeeIds();
