import { useState} from "react";
import {
  handleGetDirectory,
  handleAddEmployee,
  handleEditEmployee,
  handleDeleteEmployee,
} from "./HandlerFunctions";

      export function Table() {
        const [employees, setEmployees] = useState([]);
        const [directoryFetched, setDirectoryFetched] = useState(false);
      
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
                  </tr>
                </thead>
                <tbody>
                  {employees.map(({ id, name, department, location, email }) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{department}</td>
                      <td>{location}</td>
                      <td>{email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div>
              <button id="get-directory" onClick={() => handleGetDirectory(setEmployees, directoryFetched, setDirectoryFetched)}>
                View/Close Directory
              </button>
              <button id="add-employee" onClick={() => handleAddEmployee(setEmployees)}>
                Add New Employee
              </button>
              <button id="edit-employee" onClick={() => handleEditEmployee(setEmployees)}>
                Edit Employee Details
              </button>
              <button id="delete-employee" onClick={() => handleDeleteEmployee(setEmployees)}>
                Delete Employee
              </button>
            </div>
          </>
        );
      }