import express from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//file and directory names
const __filename = fileURLToPath(import.meta.url); //add for it to work for for ES Modules
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

//create path to employee.json
const employeesFilePath = path.join(__dirname, "../data/employees.json");

//assign data from file to variable, parse into json format 
function readEmployeesFromFile() {
  const data = fs.readFileSync(employeesFilePath, "utf8");
  return JSON.parse(data).employees;
}

//add in the functionality to increase ID number each time when adding a new one
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

//edit and add to files by writing to them 
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
  //checks if object is defined and not empty, if either not met logs error
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

  const addNewEmployee = {
    id: nextId,
    ...newEmployee,
  };

  //add employee to file
  employees.push(addNewEmployee);
  writeEmployeesToFile(employees);

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
