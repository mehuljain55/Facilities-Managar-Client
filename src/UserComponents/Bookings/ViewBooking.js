import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import API_BASE_URL from "../Config/Config";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

const getStartOfWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getEndOfWeek = () => {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

const getStartOfMonth = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  return startOfMonth;
};

const getEndOfMonth = () => {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return endOfMonth;
};

const ViewBooking = ({ selectedFilterType }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(selectedFilterType || "All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");

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
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/admin/booking/viewBooking`, userRequest);

        if (response.data.status === 'success') {
          setBookingRequests(response.data.payload);
          setFilteredRequests(response.data.payload);
          handleFilterChange(selectedFilterType || filter); // Apply filter after data fetch
        } else {
          console.log('Failed to fetch booking requests');
        }
      } catch (err) {
        console.log('Error fetching booking requests');
      }
      setLoading(false);
    };

    fetchBookingRequests();
  }, []); // Empty array to load data once on component mount

  useEffect(() => {
    if (selectedFilterType) {
      console.log("Selected Filter Type:", selectedFilterType);
      console.log("Booking Requests:", bookingRequests);
      setFilter(selectedFilterType); // Update local filter state
      handleFilterChange(selectedFilterType); // Automatically apply the filter
    }
  }, [selectedFilterType, bookingRequests]); // Ensure bookingRequests is in the dependency array
  

  const isDateRangeInInterval = (bookingStart, bookingEnd, rangeStart, rangeEnd) => {
    return (
      (bookingStart >= rangeStart && bookingStart <= rangeEnd) || // Booking starts within range
      (bookingEnd >= rangeStart && bookingEnd <= rangeEnd) || // Booking ends within range
      (bookingStart <= rangeStart && bookingEnd >= rangeEnd) // Booking spans the range
    );
  };

  const filterByToday = (bookingRequests) => {
    const filterStartDate = getToday();
    const filterEndDate = getTomorrow();
    return bookingRequests.filter((request) => {
      const bookingStart = new Date(request.startDate);
      const bookingEnd = new Date(request.endDate);
      return isDateRangeInInterval(bookingStart, bookingEnd, filterStartDate, filterEndDate);
    });
  };

  const filterByThisWeek = (bookingRequests) => {
    const filterStartDate = getStartOfWeek();
    const filterEndDate = getEndOfWeek();
    return bookingRequests.filter((request) => {
      const bookingStart = new Date(request.startDate);
      const bookingEnd = new Date(request.endDate);
      return isDateRangeInInterval(bookingStart, bookingEnd, filterStartDate, filterEndDate);
    });
  };

  const filterByThisMonth = (bookingRequests) => {
    const filterStartDate = getStartOfMonth();
    const filterEndDate = getEndOfMonth();
    return bookingRequests.filter((request) => {
      const bookingStart = new Date(request.startDate);
      const bookingEnd = new Date(request.endDate);
      return isDateRangeInInterval(bookingStart, bookingEnd, filterStartDate, filterEndDate);
    });
  };

  const filterByCustomDate = (bookingRequests, startDate, endDate) => {
    return bookingRequests.filter((request) => {
      const bookingStart = new Date(request.startDate);
      const bookingEnd = new Date(request.endDate);
      return isDateRangeInInterval(bookingStart, bookingEnd, startDate, endDate);
    });
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    let filteredData = bookingRequests;

    switch (filter) {
      case 'Today':
        filteredData = filterByToday(bookingRequests);
        break;
      case 'This Week':
        filteredData = filterByThisWeek(bookingRequests);
        break;
      case 'This Month':
        filteredData = filterByThisMonth(bookingRequests);
        break;
      case 'All':
        filteredData = bookingRequests; // No filter, show all requests
        break;
      case 'Custom Date':
        if (startDate && endDate) {
          filteredData = filterByCustomDate(bookingRequests, startDate, endDate);
        }
        break;
      default:
        break;
    }

    setFilteredRequests(filteredData);
  };

  const exportData = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/export/bookings`, filteredRequests, {
            responseType: 'blob', // Expect binary data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Create a URL for the blob and trigger download
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Bookings.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error("Error exporting data", error);
    }
};

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    if (start && end && start > end) {
      alert("End date must be greater than start date.");
      setStartDate(null);
      setEndDate(null);
      setError("End date must be greater than start date.");
    } else {
      setStartDate(start);
      setEndDate(end);
      setError("");
    }
  };

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const filteredData = bookingRequests.filter((request) => {
        const bookingStart = new Date(request.startDate);
        const bookingEnd = new Date(request.endDate);
        return isDateRangeInInterval(bookingStart, bookingEnd, startDate, endDate);
      });
      setFilteredRequests(filteredData);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Bookings</h2>

      <div className="mt-3">
        <Button variant={filter === 'All' ? 'primary' : 'secondary'} onClick={() => handleFilterChange('All')} className="mx-2">All</Button>
        <Button variant={filter === 'Today' ? 'primary' : 'secondary'} onClick={() => handleFilterChange('Today')} className="mx-2">Today</Button>
        <Button variant={filter === 'This Week' ? 'primary' : 'secondary'} onClick={() => handleFilterChange('This Week')} className="mx-2">This Week</Button>
        <Button variant={filter === 'This Month' ? 'primary' : 'secondary'} onClick={() => handleFilterChange('This Month')} className="mx-2">This Month</Button>
        <Button variant={filter === 'Custom Date' ? 'primary' : 'secondary'} onClick={() => handleFilterChange('Custom Date')} className="mx-2">Custom Date</Button>
      </div>

      {filter === 'Custom Date' && (
        <div className="mt-3">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select Date Range"
            className="form-control"
            maxDate={endDate ? endDate : undefined}
          />
          {error && <div className="text-danger mt-2">{error}</div>}

          <Button variant="primary" onClick={handleApplyFilter} className="mt-3">Apply Filter</Button>
        </div>
      )}

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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.bookingId}>
                  <td>{request.bookingId}</td>
                  <td>{request.cabinId}</td>
                  <td>{request.userId}</td>
                  <td>{request.purpose}</td>
                  <td>{request.officeId}</td>
                  <td>{request.validFrom}</td>
                  <td>{request.validTill}</td>
                  <td>{new Date(request.startDate).toLocaleDateString("en-GB")}</td>
                  <td>{new Date(request.endDate).toLocaleDateString("en-GB")}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No booking requests found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
         <Button variant="primary" onClick={exportData} className="mt-3">
                Export
            </Button>
    </div>
  );
};

export default ViewBooking;