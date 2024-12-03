import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Dropdown, Form } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";

const CabinApproveRequest = ({ filterStatus }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [availableCabins, setAvailableCabins] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [filterType, setFilterType] = useState(filterStatus || "all");

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchBookingRequests = async () => {
    setLoading(true);
    setError(null);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    if (!user || !token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/booking/viewRequest`, {
        token,
        user,
      });

      if (response.data.status === 'success') {
        setBookingRequests(response.data.payload);
        setFilteredRequests(response.data.payload); // Initialize with all data
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


  const applyFilter = (filterType) => {
    const now = new Date();
    let filteredData = bookingRequests;
  
    switch (filterType) {
      case 'today':
        filteredData = bookingRequests.filter((request) => {
          const requestDate = new Date(request.requestDate);
          return requestDate.toDateString() === now.toDateString();
        });
        break;
  
      case 'lastWeek':
        const lastWeekStart = new Date();
        lastWeekStart.setDate(now.getDate() - 7);
        filteredData = bookingRequests.filter((request) => {
          const requestDate = new Date(request.requestDate);
          return requestDate >= lastWeekStart && requestDate <= now;
        });
        break;
  
      case 'lastMonth':
        const lastMonthStart = new Date();
        lastMonthStart.setMonth(now.getMonth() - 1);
        filteredData = bookingRequests.filter((request) => {
          const requestDate = new Date(request.requestDate);
          return requestDate >= lastMonthStart && requestDate <= now;
        });
        break;
  
      case 'all':
      default:
        filteredData = bookingRequests; // No filtering applied
        break;
    }
  
    setFilteredRequests(filteredData);
  };
  
  const handleFilterButtonClick = (type) => {
    setFilterType(type);
    applyFilter(filterType);
  };
  
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

      console.log(response.data.status);
      console.log(response.data.msg);
      
      
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

      <div className="d-flex align-items-center mt-3">
        <Button variant="primary" className="me-2" onClick={() => handleFilterButtonClick('today')}>
          Today
        </Button>
        <Button variant="primary" className="me-2" onClick={() => handleFilterButtonClick('lastWeek')}>
          Last Week
        </Button>
        <Button variant="primary" className="me-2" onClick={() => handleFilterButtonClick('lastMonth')}>
          Last Month
        </Button>
        <Button variant="primary" onClick={() => handleFilterButtonClick('all')}>
          All
        </Button>
      </div>

      {loading ? (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              
              <th>Request ID</th>
              <th> Date</th>
              
              <th>Cabin ID</th>
              <th>User ID</th>
              <th>Purpose</th>
              <th>Office ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{request.requestDate}</td>
              
                  <td>{request.cabinId}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.status}</td>
                  <td>
                  <Button variant="dark" onClick={() => handleApprove(request)}>Approve</Button>
                  <Button variant="red" onClick={() => handleCancelBooking(request)}>Reject</Button>
                  </td>
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
