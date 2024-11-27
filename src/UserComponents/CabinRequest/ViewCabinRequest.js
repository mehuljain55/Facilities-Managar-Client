import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const ViewCabinRequest = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      setLoading(true);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = sessionStorage.getItem('token');

      if (!user || !token) {
        setLoading(false);
        return;
      }

      const bookingRequest = {
        token: token,
        user: user,
      }

      console.log("Data", bookingRequest);

      try {
        const response = await axios.post(`${API_BASE_URL}/user/viewRequest`, bookingRequest);

        if (response.data.status === 'success') {
          setBookingRequests(response.data.payload);
        } else {
          console.log('Failed to fetch booking requests');
        }
      } catch (err) {
        console.log('Error fetching booking requests');
      }
      setLoading(false);
    };

    fetchBookingRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Booking Requests</h2>
      
   

   
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
                <td colSpan="8" className="text-center">
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

export default ViewCabinRequest;