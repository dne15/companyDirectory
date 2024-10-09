import { useState } from "react";
import {
  handleGetDirectory,
  handleAddEmployee,
  handleEditEmployee,
  handleDeleteEmployee,
} from "./HandlerFunctions";

export function Table() {
  //employee list 
  const [employees, setEmployees] = useState([]);
  //open and close directory
  const [directoryFetched, setDirectoryFetched] = useState(false);
  //add state for new employee, set as empty to inject props
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    location: "",
    email: "",
  });

//manage input from form 
  const handleinput = (ev) => {
    const { name, value } = ev.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

//manage submit from form for new employee
  const handleSubmit = (ev) => {
    ev.preventDefault();
    handleAddEmployee(setEmployees, newEmployee);
    //reset form 
    setNewEmployee({
      name: "",
      department: "",
      location: "",
      email: "",
    });
  };

  const handleEditButton = (employee) => {
    //set up prompts to get new info for employee and assign to key
    const name = prompt("Enter new name", employee.name);
    const department = prompt("Enter new department", employee.department);
    const location = prompt("Enter new location", employee.location);
    const email = prompt("Enter new email", employee.email);

    //check all are filled in, give error if not 
    if (name && department && location && email) {
      const updatedEmployee = {
        ...employee,
        name,
        department,
        location,
        email,
      };
      handleEditEmployee(setEmployees, updatedEmployee);
    } else {
      alert("All fields are required.");
    }
  };
//display table if state st for directory
  return (
    <>
      {directoryFetched && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Location</th>
              <th>Email Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {/*map through employees to retrieve data, each row has the below*/}
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.location}</td>
                <td>{employee.email}</td>
                <td>
            {/* added edit button next to each employee*/}
                  <button onClick={() => handleEditButton(employee)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>     
          {/*get directory button, added state for when toggle closed      */}
        <button
          id="get-directory"
          onClick={() =>
            handleGetDirectory(setEmployees, directoryFetched, setDirectoryFetched)
          }
        >
          View/Close Directory
        </button>
          {/* Form for submitting new employee */}
        <form onSubmit={handleSubmit}>
          <p>Add New Employee</p>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleinput}
              required
            />
          </label>
          <br />
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={newEmployee.department}
              onChange={handleinput}
              required
            />
          </label>
          <br />
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={newEmployee.location}
              onChange={handleinput}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleinput}
              required
            />
          </label>
          <br />
          <button type="submit">Add Employee</button>
        </form>

        <button id="delete-employee" onClick={() => handleDeleteEmployee(setEmployees)}>
          Delete Employee
        </button>
      </div>
    </>
  );
}