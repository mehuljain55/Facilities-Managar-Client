import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const UserApprovalList = () => {
  
  const [userApprovalRequestList, setUserApprovalRequestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserApprovalRequests = async () => {
      setLoading(true);
      setError(null);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = sessionStorage.getItem('token');

      if (!user || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const userApprovalRequest = {
        token: token,
        user: user,
      }


      try {
        const response = await axios.post(`${API_BASE_URL}/manager/userApprovalList`, userApprovalRequest);

        if (response.data.status === 'success') {
            setUserApprovalRequestList(response.data.payload);
        } else {
          setError('Failed to fetch appoval requests');
        }
      } catch (err) {
        setError('Error fetching appoval requests');
      }
      setLoading(false);
    };

    fetchUserApprovalRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2>User Approval Requests</h2>
      
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {loading ? (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Email ID</th>
            
              <th>Name</th>
              <th>Contact Number</th>
              <th>Role</th>
              <th>Office ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userApprovalRequestList.length > 0 ? (
              userApprovalRequestList.map((request) => (
                <tr key={request.emailId}>
                  <td>{request.emailId}</td>
                  <td>{request.name}</td>
                  <td>{request.mobileNo}</td>
                  <td>{request.role}</td>
                
                  <td>{request.officeId}</td>
                  <td>{request.status}</td>
                  <button type="button" class="btn btn-dark">Approve</button>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No approval requests found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserApprovalList;