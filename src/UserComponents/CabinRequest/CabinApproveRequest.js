import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Dropdown } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";
import './CabinApproveRequest.css';

const CabinApproveRequest = ({ filterStatus }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [availableCabins, setAvailableCabins] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [selectedCabinName, setSelectedCabinName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState(filterStatus || "all");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const userData = JSON.parse(sessionStorage.getItem('user'));

  const fetchBookingRequests = async (startDate, endDate) => {
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
      const body = { token, user };
      if (startDate && endDate) {
        body.startDate = startDate;
        body.endDate = endDate;
      }

      const response = await axios.post(`${API_BASE_URL}/admin/booking/viewRequestByDate`, body);

      if (response.data.status === 'success') {
        setBookingRequests(response.data.payload);
        setFilteredRequests(response.data.payload);
      } else {
        setError('Failed to fetch booking requests');
      }
    } catch (err) {
      setError('Error fetching booking requests');
    }
    setLoading(false);
  };

  const fetchAllBookingRequests = async (startDate, endDate) => {
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
      const body = { token, user };
     

      const response = await axios.post(`${API_BASE_URL}/admin/booking/viewRequest`, body);

      if (response.data.status === 'success') {
        setBookingRequests(response.data.payload);
        setFilteredRequests(response.data.payload);
      } else {
        setError('Failed to fetch booking requests');
      }
    } catch (err) {
      setError('Error fetching booking requests');
    }
    setLoading(false);
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
    } finally {
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

  useEffect(() => {
    if (filterType === 'all') {
      fetchAllBookingRequests(); 
    } else {
      applyFilter(filterType); 
    }
  }, [filterType]);

  const applyFilter = (filterType) => {
    const now = new Date();
    let start = null;
    let end = null;

    switch (filterType) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;

      case 'lastWeek':
        start = new Date();
        start.setDate(now.getDate() - 7);
        end = new Date();
        break;

      case 'lastMonth':
        start = new Date();
        start.setMonth(now.getMonth() - 1);
        end = new Date();
        break;

      default:
        break;
    }

    if (start && end) {
      fetchBookingRequests(start, end);
    }
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

  const handleFilterButtonClick = (type) => {
    setFilterType(type);
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



  const filterButtonStyle = (type) => ({
    backgroundColor: filterType === type ? 'darkblue' : 'lightblue',
    color: filterType === type ? 'white' : 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    marginRight: '10px',
    fontWeight: 'bold',
  });

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
    } finally {
      fetchBookingRequests();
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cabin Approval</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="d-flex align-items-center mt-3">
        <button
          style={filterButtonStyle('today')}
          onClick={() => handleFilterButtonClick('today')}
        >
          Today
        </button>
        <button
          style={filterButtonStyle('lastWeek')}
          onClick={() => handleFilterButtonClick('lastWeek')}
        >
          Last Week
        </button>
        <button
          style={filterButtonStyle('lastMonth')}
          onClick={() => handleFilterButtonClick('lastMonth')}
        >
          Last Month
        </button>
        <button
          style={filterButtonStyle('all')}
          onClick={() => handleFilterButtonClick('all')}
        >
          All
        </button>
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
              <th>Request Date</th>
              <th>Cabin ID</th>
              <th>Cabin Name</th>
              <th>User ID</th>
              <th>Purpose</th>
              <th>Office ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              
              <th>Status</th>
              {userData.role !== 'super_admin' && ( 
                     <th>Action</th>
                  )}  
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{new Date(request.requestDate).toLocaleDateString('en-GB')}</td>
                  <td>{request.cabinId}</td>
                  <td>{request.cabinName}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{new Date(request.startDate).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(request.endDate).toLocaleDateString('en-GB')}</td>
                  <td>{formatTo12Hour(request.validFrom)}</td>
                  <td>{formatTo12Hour(request.validTill)}</td>
                  <td>{request.status}</td>
                  {userData.role !== 'super_admin' && ( 
                     <div className="button-group">
                     <Button variant="success" onClick={() => handleApprove(request)}>Approve</Button>
                     <Button variant="danger" onClick={() => handleCancelBooking(request)}>Reject</Button>
                     </div>
                  )}  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">No booking requests found</td>
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
          <p><strong>User ID:</strong> {selectedRequest?.userId}</p>
          
          <p><strong>Cabin ID:</strong> {selectedRequest?.cabinId}</p>
          <p><strong>Cabin Name:</strong> {selectedRequest?.cabinName}</p>
        
          <Dropdown>
            <Dropdown.Toggle variant="primary">
              {selectedCabin ? `Cabin Name: ${availableCabins.find(cabin => cabin.cabinId === selectedCabin)?.cabinName}` : 'Select Cabin'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {availableCabins.map((cabin) => (
                <Dropdown.Item
                  key={cabin.cabinId}
                  onClick={() => cabin.status !== 'Booked' && setSelectedCabin(cabin.cabinId) }
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
          <Button variant="primary" onClick={handleConfirmApproval} disabled={!selectedCabin}>Approve</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CabinApproveRequest;
