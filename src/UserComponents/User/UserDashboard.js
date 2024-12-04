import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import API_BASE_URL from "../Config/Config";
const UserDashboard = () => {
  const [selectedOffice, setSelectedOffice] = useState("YIT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cabins, setCabins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCabinBookings, setSelectedCabinBookings] = useState([]);

  const userData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

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

  return (
    <div className="container mt-4">
      <h2>User Dashboard</h2>

     
      <div className="d-flex justify-content-around mb-4">
        {["YIT", "CIT", "BTC"].map((office) => (
          <button
            key={office}
            className={`btn ${selectedOffice === office ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedOffice(office)}
          >
            {office}
          </button>
        ))}
      </div>

    
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

     
      {cabins.length > 0 && (
        <div>
          <h4>Cabin List</h4>
          <Table striped bordered hover>
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
                      className="btn btn-info"
                      onClick={() => handleViewBookings(cabinData.bookings)}
                      disabled={cabinData.bookings.length === 0}
                    >
                      View Bookings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="modal-lg" 
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    <td>{booking.startDate}</td>
                    <td>{booking.endDate}</td>
                    <td>{booking.validFrom}</td>
                    <td>{booking.validTill}</td>
                    <td>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No bookings available for this cabin.</p>
          )}
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
