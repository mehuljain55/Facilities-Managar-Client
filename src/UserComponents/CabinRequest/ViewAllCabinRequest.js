import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Dropdown } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const ViewAllCabinRequest = () => {
  const [officeId, setOfficeId] = useState('YIT'); 
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingRequests = async () => {
      setBookingRequests([]);
      setLoading(true);
      setError(null);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = sessionStorage.getItem('token');

      if (!user || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const bookingRequest = {
        token: token,
        user: user,
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/manager/viewAllCabinRequest`, bookingRequest);

        if (response.data.status === 'success') {
          setBookingRequests(response.data.payload);
        } else {
          setError('Failed to fetch booking requests');
        }
      } catch (err) {
        setError('Error fetching booking requests');
      }
      setLoading(false);
    };

    fetchBookingRequests();
  }, [officeId]);

 

  
  
  return (
    <div className="container mt-5">
      <h2>Booking Requests</h2>
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {loading ? (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Cabin ID</th>
              <th>User ID</th>
              <th>Purpose</th>
              <th>Office ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Booking Validity</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {bookingRequests.length > 0 ? (
              bookingRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{request.cabinId}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.bookingValadity}</td>
                  <td>{request.status}</td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No booking requests found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

    
    </div>
  );
};

export default ViewAllCabinRequest;
