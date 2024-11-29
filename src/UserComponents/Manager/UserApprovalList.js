import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Dropdown } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const UserApprovalList = () => {
  
  const [userApprovalRequestList, setUserApprovalRequestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleConfirmApproval = async (request) => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    try {

      const userApprovalRequest = {
        token,
        user: userData,
        employeeId: request.emailId,
      };

     
      const response = await axios.post(`${API_BASE_URL}/manager/approve`, userApprovalRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      fetchUserApprovalRequests();

      if (response.data.status === 'success') {
        alert('User approved');

      } else {
        alert('Unable to approve user');
      }
    } catch (err) {
      alert('Error approving user');
    }
  };

  const handleBlockUser = async (request) => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    try {

      const userApprovalRequest = {
        token,
        user: userData,
        employeeId: request.emailId,
      };

   
      const response = await axios.post(`${API_BASE_URL}/manager/block`, userApprovalRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      fetchUserApprovalRequests();
      
      if (response.data.status === 'success') {
        alert('User blocked');

      } else {
        alert('Unable to block user');
      }
    } catch (err) {
      alert('Error blocking user');
    }
  };



  const fetchUserApprovalRequests = async () => {
    setUserApprovalRequestList([]);
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

  

  useEffect(() => {
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
                  <Button variant="green" onClick={() => handleConfirmApproval(request)}>Approve</Button>
                  <Button variant="red" onClick={() => handleBlockUser(request)}>Block</Button>
                  
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