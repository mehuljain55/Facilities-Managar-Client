import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const ViewCabinRequest = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');  

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
      };

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

  const formatTo12Hour = (time) => {
    if (!time) return ""; 

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const filteredRequests = filterStatus === 'all'
    ? bookingRequests
    : bookingRequests.filter(request => request.status.toLowerCase() === filterStatus.toLowerCase());

    

  return (
    <div className="container mt-5">
      <h2>Booking Requests</h2>


      <DropdownButton
        id="status-filter-dropdown"
        title={`Status: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`}
        className="mb-3"
        onSelect={(status) => setFilterStatus(status)} // Update filter status when selection changes
      >
        <Dropdown.Item eventKey="all">All</Dropdown.Item>
        <Dropdown.Item eventKey="approved">Approved</Dropdown.Item>
        <Dropdown.Item eventKey="rejected">Rejected</Dropdown.Item>
        <Dropdown.Item eventKey="hold">Hold</Dropdown.Item>
      </DropdownButton>

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
              <th>Start Time</th>
              <th>End Time</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Booking Validity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{request.cabinId}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{formatTo12Hour(request.validFrom)}</td>
                  <td>{formatTo12Hour(request.validTill)}</td>
             
                  <td>{new Date(request.startDate).toLocaleDateString("en-GB")}</td>
                  <td>{new Date(request.endDate).toLocaleDateString("en-GB")}</td>
               
                  <td>{request.bookingValadity}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
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
