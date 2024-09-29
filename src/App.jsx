import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "", id: null });

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search Function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Delete User Function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete the user?");
    if (isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:8000/users/${id}`);
        setUsers(res.data);
        setFilterUsers(res.data);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  // Add or Update User
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "", id: null });
    setIsModalOpen(true);
  };
 
  // Handle Data Change
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.id) {
      // Update User
      try {
        await axios.patch(`http://localhost:8000/users/${userData.id}`, userData);
        closeModal();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      // Add New User
      try {
        await axios.post("http://localhost:8000/users", userData);
        closeModal();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  // Set Modal Data for Editing
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
      <div className="input-search">
        <input type="search" placeholder="Search Text Here" onChange={handleSearchChange} />
        <button className="btn green" onClick={handleAddRecord}>Add Record</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers &&
            filterUsers.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn green" onClick={() => handleUpdateRecord(user)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="btn red">Delete</button>
                  </td>
                </tr>
              );
            })} 
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{userData.id ? "Update User Record" : "Add User Record"}</h2>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" value={userData.name} name="name" id="name" onChange={handleData} />
            </div>
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input type="number" value={userData.age} name="age" id="age" onChange={handleData} />
            </div>
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input type="text" value={userData.city} name="city" id="city" onChange={handleData} />
            </div>
            <button className="btn green" onClick={handleSubmit}>
              {userData.id ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
  
export default App;
