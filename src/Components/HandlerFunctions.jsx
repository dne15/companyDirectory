export async function handleAddEmployee(setEmployees) {
    console.log("Add New Employee button clicked");
  
    const newEmployee = {
      name: "John Doe", // Real data instead of placeholders
      department: "Engineering",
      location: "New York",
      email: "john.doe@example.com",
    };
  
    try {
      const response = await fetch("http://localhost:3000/directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (response.ok) {
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
  
  export async function handleGetDirectory(setEmployees, directoryFetched, setDirectoryFetched) {
    if (directoryFetched) {
      // Close directory
      setEmployees([]);
      setDirectoryFetched(false);
    } else {
      try {
        const response = await fetch("http://localhost:3000/directory");
        const data = await response.json();
        if (response.ok) {
          setEmployees(data.payload);
          setDirectoryFetched(true);
        } else {
          throw new Error("Failed to fetch directory");
        }
      } catch (error) {
        console.error("Error fetching directory:", error);
        alert("Error fetching directory");
      }
    }
  }
  
  export async function handleEditEmployee(setEmployees) {
      console.log("Edit Employee button clicked")
      const employeeID = prompt("Enter ID to edit");
      if (!employeeID){
        alert("Invalid ID")
      };
      try {
        const response = await fetch(`http://localhost:3000/directory/${employeeID}`, {
          method: "PUT"
        });
        const data = await response.json();
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== data.payload.id));
        } catch (error) {
          console.error("Error deleting employee", error);
        }}
  

  export async function handleDeleteEmployee(setEmployees) {
      console.log("Delete Employee button clicked");
      const employeeID = prompt("Enter ID to delete");
      if (!employeeID){
        alert("Invalid ID")
      };
      try {
      const response = await fetch(`http://localhost:3000/directory/${employeeID}`, {
        method: "DELETE"
      });
      const data = await response.json();
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== data.payload.id));
      } catch (error) {
        console.error("Error deleting employee", error);
      }}