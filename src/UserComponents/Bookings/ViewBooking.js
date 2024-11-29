import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const ViewBooking = () => {
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

      const userRequest = {
        token: token,
        user: user,
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/admin/booking/viewBooking`, userRequest);

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
              <th>Booking ID</th>
              <th>Cabin ID</th>
              <th>User ID</th>
              <th>Purpose</th>
              <th>Office ID</th>
              <th>Valid From</th>
              <th>Valid Till</th>
              <th>Start Date</th>
              <th>End Date</th>
               </tr>
          </thead>
          <tbody>
            {bookingRequests.length > 0 ? (
              bookingRequests.map((request) => (
                <tr key={request.bookingId}>
                  <td>{request.bookingId}</td>
                  <td>{request.cabinId}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{request.validFrom}</td>
                  <td>{request.validTill}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
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

export default ViewBooking;