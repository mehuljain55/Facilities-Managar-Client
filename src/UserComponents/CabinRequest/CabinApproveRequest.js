import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Dropdown } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const CabinApproveRequest = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [availableCabins, setAvailableCabins] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      const response = await axios.post(`${API_BASE_URL}/admin/booking/viewRequest`, bookingRequest);

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



  useEffect(() => {
  
    fetchBookingRequests();
  }, []);

  const handleApprove = async (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/cabin/findAvailableCabins`, {
        token,
        user,
        cabinAvaliableModel: {
          startDate: request.startDate,
          endDate: request.endDate,
          validFrom: request.validFrom,
          validTill: request.validTill,
          bookingValadity: request.bookingValadity,
          bookingType: "Allotment",
          officeId: request.officeId,
        },
      });

      if (response.data.status === 'success') {
        setAvailableCabins(response.data.payload);
      } else {
        setError('Failed to fetch available cabins');
      }
    } catch (err) {
      setError('Error fetching available cabins');
    }
  };

  const handleConfirmApproval = async () => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    try {
      const booking = {
        token,
        user: userData,
        cabinRequestModel: {
          requestId: selectedRequest.requestId,
          cabinId: selectedCabin
        },
      };

      const response = await axios.post(`${API_BASE_URL}/admin/booking/approveBooking`, booking, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.status === 'success') {
        alert('Booking approved successfully');
        setShowModal(false);
        setSelectedRequest(null);
        setSelectedCabin(null);
        setBookingRequests((prev) => prev.filter((req) => req.requestId !== selectedRequest.requestId));
      } else {
        alert('Failed to approve booking');
      }
    } catch (err) {
      alert('Error approving booking');
    }finally{
      fetchBookingRequests();
    }
  };

  const handleCancelBooking = async (request) => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    try {
      const booking = {
        token,
        user: userData,
        cabinRequestModel: {
          requestId: request.requestId,
        },
      };

      const response = await axios.post(`${API_BASE_URL}/admin/booking/cancelRequest`, booking, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.status === 'success') {
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      alert('Error cancelling booking');
    }finally{
      fetchBookingRequests();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Booked':
        return 'red';
      case 'Requested':
        return 'blue';
      case 'Available':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cabin Approval</h2>
      
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
              <th>Availability</th>
              <th>Action</th>
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
                  <td>{request.cabinAvaiability}</td>
                  <td>
                    <Button variant="dark" onClick={() => handleApprove(request)}>Approve</Button>
                    <Button variant="red" onClick={() => handleCancelBooking(request)}>Cancel</Button>
                  </td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Request ID:</strong> {selectedRequest?.requestId}</p>
          <p><strong>Cabin ID:</strong> {selectedRequest?.cabinId}  
          <strong>  Cabin Name:</strong> {selectedRequest?.cabinName} 
          </p>
          
          <p><strong>User ID:</strong> {selectedRequest?.userId}</p>
          <p><strong>Purpose:</strong> {selectedRequest?.purpose}</p>

          <p><strong>Start Date:</strong> {selectedRequest?.startDate}</p>
          <p><strong>End Date:</strong> {selectedRequest?.endDate}</p>
          <p><strong>Cabin Status:</strong> {selectedRequest?.cabinAvaiability}</p>
          
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              {selectedCabin ? `Cabin ID: ${selectedCabin}` : 'Select Cabin'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {availableCabins.map((cabin) => (
                <Dropdown.Item
                  key={cabin.cabinId}
                  onClick={() => cabin.status !== 'Booked' && setSelectedCabin(cabin.cabinId)}
                  disabled={cabin.status === 'Booked'}
                >
                  {cabin.cabinName} ( Capacity: {cabin.capacity} ) 
                  <span style={{ color: getStatusColor(cabin.status) }}> (Status: {cabin.msg})</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleConfirmApproval} disabled={!selectedCabin}>
            Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CabinApproveRequest;
