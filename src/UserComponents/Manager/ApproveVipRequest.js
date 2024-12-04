import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../Config/Config";

const ApproveVipRequest = () => {
  const [startDate, setStartDate] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [officeId, setOfficeId] = useState("YIT");
  const [vipUserId, setVipUserId] = useState("");
  const [availableCabins, setAvailableCabins] = useState([]);
  const [selectedCabin, setSelectedCabin] = useState("");
  const [userBooking, setUserBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userBookingCabins, setUserBookingCabins] = useState([]);


  const userData = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const handleFetchAvailableCabins = async () => {
    const payload = {
      cabinAvaliableModel: {
        startDate,
        validFrom,
        validTill,
        bookingValadity: "single_day",
        officeId,
      },
      user: userData,
      token,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/cabin/findAvailableCabins`,
        payload
      );
      const cabins = response.data.payload || [];
      setAvailableCabins(cabins);
      if (cabins.length > 0) {
        setSelectedCabin(cabins[0].cabinId);
      }
    } catch (error) {
      console.error("Error fetching cabins", error);
    }
  };

  const handleViewUserBooking = async () => {
    if (!selectedCabin) {
      alert("Please select a cabin before viewing booking details.");
      return;
    }

    const payload = {
      cabinAvaliableModel: {
        startDate,
        validFrom,
        validTill,
        bookingValadity: "single_day",
        cabinId: selectedCabin,
      },
      user: userData,
      token,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/booking/viewUserCabinBooking`,
        payload
      );
      setUserBooking(response.data.payload?.[0] || null);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user booking", error);
    }
  };

  const handleModifyCabin = async (newCabinId) => {
    const payload = {
      token,
      user: userData,
      userCabinModifyModel: {
        bookingId: userBooking.bookingId,
        newCabinId,
      },
    };

    try {
      await axios.post(`${API_BASE_URL}/save`, payload);
      alert("Cabin modified successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error modifying cabin", error);
    }
  };

  const handleCancelBooking = async () => {
    const payload = {
      token,
      user: userData,
      userCabinModifyModel: {
        bookingId: userBooking.bookingId,
        newCabinId: userBooking.cabinId,
        status: "CANCEL",
      },
    };

    try {
      await axios.post(`${API_BASE_URL}/save`, payload);
      alert("Booking canceled successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error canceling booking", error);
    }
  };

  const handleFetchNewCabinList = async () => {
    if (!userBooking) {
      alert("User booking details are missing.");
      return;
    }
  
    const cabinRequestModel = {
      cabinAvaliableModel: {
        startDate: userBooking.date, 
        validFrom: userBooking.validFrom,
        validTill: userBooking.validTill,
        bookingValadity: "single_day",
        officeId: userBooking.officeId, 
      },
      user: userData,
      token: token,
    };
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cabin/findAvailableCabins`,
        cabinRequestModel
      );
      let cabins = response.data.payload || [];
  
    
      cabins = cabins.filter((cabin) => cabin.cabinId !== userBooking.cabinId);
  
      setUserBookingCabins(cabins);
      if (cabins.length > 0) {
        setSelectedCabin(cabins[0].cabinId); 
      }
    } catch (error) {
      console.error("Error fetching new cabins for modification", error);
    }
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return "text-danger"; // Red color for Booked
      case "Requested":
        return "text-warning"; // Yellow for requested
      case "Avaliable":
        return "text-success"; // Green for available
      default:
        return "";
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Approve VIP Request</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Valid From</Form.Label>
          <Form.Control
            type="time"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Valid Till</Form.Label>
          <Form.Control
            type="time"
            value={validTill}
            onChange={(e) => setValidTill(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Office ID</Form.Label>
          <Form.Select
            value={officeId}
            onChange={(e) => setOfficeId(e.target.value)}
          >
            <option value="YIT">YIT</option>
            <option value="CIT">CIT</option>
            <option value="BTC">BTC</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>VIP User ID</Form.Label>
          <Form.Control
            type="text"
            value={vipUserId}
            onChange={(e) => setVipUserId(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleFetchAvailableCabins}>Fetch Available Cabins</Button>
      </Form>

      {availableCabins.length > 0 && (
        <div className="mt-4">
          <h3>Available Cabins</h3>
          <Form.Select
            onChange={(e) => setSelectedCabin(e.target.value)}
            value={selectedCabin}
          >
            {availableCabins.map((cabin) => (
              <option key={cabin.cabinId} value={cabin.cabinId}>
             {cabin.cabinId}-  {cabin.cabinName} - Capacity: {cabin.capacity} 
                    <span className={getStatusColor(cabin.status)}>
                      {" - Status: " + cabin.msg}
                    </span>
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      <Button className="mt-4" onClick={handleViewUserBooking}>
        View User Booking
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>User Booking Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {userBooking ? (
      <div>
        <p><strong>Booking ID:</strong> {userBooking.bookingId}</p>
        <p><strong>Cabin ID:</strong> {userBooking.cabinId}</p>
        <p><strong>Start Date:</strong> {userBooking.date}</p>
        <p><strong>Valid From:</strong> {userBooking.validFrom}</p>
        <p><strong>Valid Till:</strong> {userBooking.validTill}</p>

        {/* Fetch new cabin list for modification */}
        <Button
          className="mt-3"
          onClick={handleFetchNewCabinList}
        >
          Fetch New Cabins
        </Button>

        {/* Dropdown for new cabin list */}
        {userBookingCabins.length > 0 && (
          <Form.Group className="mt-3">
            <Form.Label>Select a New Cabin</Form.Label>
            <Form.Select
              value={selectedCabin}
              onChange={(e) => setSelectedCabin(e.target.value)}
            >
              <option value="">Select Cabin</option>
              {userBookingCabins.map((cabin) => (
                <option key={cabin.cabinId} value={cabin.cabinId}>
                  {cabin.cabinName} - Capacity: {cabin.capacity} 
                    <span className={getStatusColor(cabin.status)}>
                      {" - Status: " + cabin.msg}
                    </span>
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
      </div>
    ) : (
      <p>No booking found.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="primary"
      onClick={() => handleModifyCabin(selectedCabin)}
      disabled={!selectedCabin}
    >
      Confirm Cabin Change
    </Button>
    <Button variant="danger" onClick={handleCancelBooking}>
      Cancel Booking
    </Button>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default ApproveVipRequest;
