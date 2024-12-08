import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import API_BASE_URL from "../Config/Config";
import './UserManagement.css'; // Import the CSS file

const UserManagement = () => {
  const [userList, setUserList] = useState([]);
  const [originalUserList, setOriginalUserList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("manager");

  const fetchUserList = async () => {
    setUserList([]);
    setLoading(true);
    setError(null);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const request = {
      token: token,
      user: user,
      accessRole: selectedRole,
      officeId: selectedOffice,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/super_admin/userList`, request);

      if (response.data.status === "success") {
        setUserList(response.data.payload);
        setOriginalUserList(response.data.payload); // Keep track of the original data for comparison
      } else {
        setError("No user found");
      }
    } catch (err) {
      setError("Error fetching user list");
    }
    setLoading(false);
  };

  const fetchOfficeList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/office/officeList`);
      if (response.data.status === "success") {
        setOfficeList(response.data.payload);
        if (response.data.payload.length > 0) {
          setSelectedOffice(response.data.payload[0]); // Set the first office as the default
        }
      } else {
        setError("Failed to fetch office list");
      }
    } catch (err) {
      setError("Error fetching office list");
    }
  };

  useEffect(() => {
    fetchOfficeList();
  }, []);

  useEffect(() => {
    fetchUserList();
  }, [selectedRole, selectedOffice]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedList = [...userList];
    updatedList[index][field] = value;
    updatedList[index]._isChanged = true; 
    setUserList(updatedList);
  };

  const handleSubmit = async () => {
    const updatedUsers = userList.filter(user => user._isChanged);

    if (updatedUsers.length === 0) {
      alert("No changes to submit");
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    const request = {
      token: token,
      user: user,
      userList: updatedUsers.map(({ _isChanged, ...rest }) => rest),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/super_admin/updateDetail`, request);

      if (response.data.status === "success") {
        alert("User data updated successfully!");
        const refreshedList = userList.map(user => ({
          ...user,
          _isChanged: false, // Reset the flag
        }));
        setUserList(refreshedList);
        fetchUserList();
      } else {
        setError("Failed to update user data");
      }
    } catch (err) {
      setError("Error updating user data");
    }
  };

  return (
    <div className="user-management-container mt-5">
      <h2>User Manager</h2>

      <div className="mb-3 d-flex align-items-center">
        <Button
          variant={selectedRole === "manager" ? "primary" : "light"}
          className="me-2"
          onClick={() => handleRoleChange("manager")}
        >
          Manager
        </Button>
        <Button
          variant={selectedRole === "user" ? "primary" : "light"}
          onClick={() => handleRoleChange("user")}
        >
          User
        </Button>

        <Form.Select
          className="ms-3"
          style={{ maxWidth: "200px" }}
          value={selectedOffice}
          onChange={handleOfficeChange}
        >
          {officeList.map((office, index) => (
            <option key={index} value={office}>
              {office}
            </option>
          ))}
        </Form.Select>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {loading ? (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="user-table-container mt-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email Id</th>
                <th>Name</th>
                <th>Mobile No</th>
                <th>
                  Office ID
                  <br />
                  <small>(Dropdown)</small>
                </th>
                <th>
                  Role
                  <br />
                  <small>(Dropdown)</small>
                </th>
                <th>
                  Status
                  <br />
                  <small>(Dropdown)</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.length > 0 ? (
                userList.map((user, index) => (
                  <tr key={user.emailId}>
                    <td>{user.emailId}</td>
                    <td>{user.name}</td>
                    <td>{user.mobileNo}</td>
                    <td>
                      <Form.Select
                        value={user.officeId}
                        onChange={(e) =>
                          handleFieldChange(index, "officeId", e.target.value)
                        }
                      >
                        {officeList.map((office, idx) => (
                          <option key={idx} value={office}>
                            {office}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Select
                        value={user.role}
                        onChange={(e) =>
                          handleFieldChange(index, "role", e.target.value)
                        }
                      >
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Select
                        value={user.status}
                        onChange={(e) =>
                          handleFieldChange(index, "status", e.target.value)
                        }
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="NOT_ACTIVE">NOT_ACTIVE</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="PENDING">PENDING</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No user list found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Button className="mt-3" onClick={handleSubmit}>
        Update
      </Button>
    </div>
  );
};

export default UserManagement;
