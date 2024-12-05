import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Dropdown, DropdownButton, Button } from "react-bootstrap";
import API_BASE_URL from "../Config/Config";

const ViewAllCabinRequest = ({ preselectedStatus }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(preselectedStatus || "all");

  const fetchBookingRequests = async () => {
    setBookingRequests([]);
    setLoading(true);
    setError(null);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const bookingRequest = {
      token: token,
      user: user,
      status: selectedStatus,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/manager/viewAllCabinRequest`, bookingRequest);

      if (response.data.status === "success") {
        setBookingRequests(response.data.payload);
      } else {
        setError("Failed to fetch booking requests");
      }
    } catch (err) {
      setError("Error fetching booking requests");
    }
    setLoading(false);
  };

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

  const exportToExcel = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/export/excel`, bookingRequests, {
        responseType: "blob", // Ensure we get binary data
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cabin_requests.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError("Failed to export data to Excel");
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, [selectedStatus]);

  return (
    <div className="container mt-5">
      <h2>Cabin Requests View</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <DropdownButton
        id="dropdown-status"
        title={`Status: ${selectedStatus}`}
        className="mt-3"
        onSelect={(status) => setSelectedStatus(status)}
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
              <th>Cabin Name</th>
           
              <th>User ID</th>
              <th>Purpose</th>
              <th>Office ID</th>
              <th>Valid From</th>
              <th>Valid Till</th>
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
                  <td>{request.cabinName}</td>
             
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
                <td colSpan="11" className="text-center">
                  No booking requests found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        
      )}
       <Button onClick={exportToExcel} className="btn btn-primary mt-3">
        Export 
      </Button>
    </div>
  );
};

export default ViewAllCabinRequest;
