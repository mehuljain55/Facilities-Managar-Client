import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Card } from "react-bootstrap";
import API_BASE_URL from "../Config/Config";
import './UserDashboard.css';

const UserDashboard = () => {
  const [officeList, setOfficeList] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cabins, setCabins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCabinBookings, setSelectedCabinBookings] = useState([]);

  const userData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const fetchOfficeList = async () => {
    const payload = {
      token: token,
      user: userData,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/user/officeList`, payload);
      setOfficeList(response.data.payload || []);
      setSelectedOffice(response.data.payload[0] || ""); // Set default selection
    } catch (error) {
      console.error("Error fetching office list:", error);
    }
  };

  
  useEffect(() => {
    
    fetchOfficeList();
  }, []);

  const fetchCabins = async () => {
    if (!startDate || !endDate) {
      return;
    }

    const payload = {
      token: token,
      user: userData,
      officeId: selectedOffice,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/user/allBookingRequestByOfficeId`, payload);
      setCabins(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching cabins:", error);
    }
  };

  const handleViewBookings = (bookings) => {
    setSelectedCabinBookings(bookings);
    setShowModal(true);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchCabins();
    }
  }, [selectedOffice, startDate, endDate]);

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

  return (
    <div className="container mt-4">
      <h2>User Dashboard</h2>

      <div className="d-flex align-items-center mb-4">
        <div className="me-3">
          <label className="form-label">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div>
          <label className="form-label">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

   
<div className="d-flex justify-content-start flex-wrap gap-2 mb-4">
  {officeList.map((office) => (
    <Card
      key={office}
      className={`office-card ${
        selectedOffice === office ? "selected-office" : ""
      }`}
      onClick={() => setSelectedOffice(office)}
    >
      <Card.Body className="text-center p-2">
        <Card.Title className="fs-6 m-0">{office}</Card.Title>
      </Card.Body>
    </Card>
  ))}
</div>

      {cabins.length > 0 && (
        <div>
          <div style={{ maxHeight: "350px", overflowY: "scroll", marginBottom: "1rem" }}>
          <Table striped bordered hover className="cabin-table">
            <thead>
              <tr>
                <th>Cabin Name</th>
                <th>Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabins.map((cabinData) => (
                <tr key={cabinData.cabin.cabinId}>
                  <td>{cabinData.cabin.cabinName}</td>
                  <td>{cabinData.cabin.capacity}</td>
                  <td>
                    <button
                      className={`btn ${
                        cabinData.bookings.length === 0 ? "btn-success" : "btn-info"
                      }`}
                      onClick={() => handleViewBookings(cabinData.bookings)}
                      disabled={cabinData.bookings.length === 0}
                    >
                      {cabinData.bookings.length === 0 ? "Available" : "View Bookings"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="modal-lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
    {selectedCabinBookings.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Purpose</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Valid From</th>
            <th>Valid Till</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedCabinBookings.map((booking) => (
            <tr key={booking.bookingId}>
              <td>{booking.bookingId}</td>
              <td>{booking.userId}</td>
              <td>{booking.purpose}</td>
              <td>{new Date(booking.startDate).toLocaleDateString('en-GB')}</td>
              <td>{new Date(booking.endDate).toLocaleDateString('en-GB')}</td>
              <td>{booking.validFrom}</td>
              <td>{booking.validTill}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>Cabin is Available</p>
    )}
  </div>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard;
