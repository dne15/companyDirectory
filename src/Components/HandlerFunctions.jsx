 //GET directory function 
  export async function handleGetDirectory(setEmployees, directoryFetched, setDirectoryFetched) {
    if (directoryFetched) {
      // if directory has been fetched, revert by setting employees to empty array and toggle to false
      setEmployees([]);
      setDirectoryFetched(false);
    } else {
      try {
        const response = await fetch("http://localhost:3000/directory");
        const data = await response.json();
        if (response.ok) {
            //update state to true to display list 
          setEmployees(data.payload);
          setDirectoryFetched(true);
        } else {
          throw new Error("Failed to fetch directory");
        }
        //error message for fetching data 
      } catch (error) {
        console.error("Error fetching directory:", error);
        alert("Error fetching directory");
      }
    }
  }

  //add new employee function
  
  export async function handleAddEmployee(setEmployees, newEmployee) {
    try {
      const response = await fetch("http://localhost:3000/directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (response.ok) {
        //update employee state with new data for employee
        const data = await response.json();
        setEmployees((prevEmployees) => [...prevEmployees, data.payload]);
        alert("New employee added successfully");
      } else {
        throw new Error("Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding new employee:", error);
      alert("Error adding new employee");
    }
  }

  //edit employee function
  
  export async function handleEditEmployee(setEmployees, updatedEmployee) {
    //props from prompts make updated employee
    const { id, name, department, location, email } = updatedEmployee;
  
    try {
      const response = await fetch(`http://localhost:3000/directory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, department, location, email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setEmployees((prevEmployees) =>
        //update employees with new data, map through to find matching ID and return new updated array
        //if ID matches new data return new, if not employee stay same
          prevEmployees.map((employee) =>
            employee.id === data.payload.id ? data.payload : employee
          )
        );
        alert("Employee updated successfully");
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error editing employee", error);
    }
  }
   
  //delete function 
  export async function handleDeleteEmployee(setEmployees) {
    const employeeID = prompt("Enter ID to delete");
    if (!employeeID) {
      alert("Invalid ID");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/directory/${employeeID}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setEmployees((prevEmployees) =>
        //filter through to find ID that matches 
        prevEmployees.filter((employee) => employee.id !== data.payload.id)
      );
    } catch (error) {
      console.error("Error deleting employee", error);
      alert("Error deleting employee");
    }
  }