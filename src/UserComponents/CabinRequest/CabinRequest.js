import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Config/Config";
import axios from "axios";

const CabinRequest = () => {
  const [bookingValidity, setBookingValidity] = useState("single_day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [purpose, setPurpose] = useState("");
  const [officeId, setOfficeId] = useState("YIT");
  const [cabins, setCabins] = useState([]);
  const [selectedCabin, setSelectedCabin] = useState("");
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const storedData = sessionStorage.getItem("user");
    return storedData ? JSON.parse(storedData) : null;
  };

  useEffect(() => {
    const fetchCabins = async () => {
      if (
        startDate &&
        (bookingValidity === "multiple_day" ? endDate : validFrom && validTill) &&
        purpose &&
        officeId
      ) {
        const userData = getUserData();
        const token = sessionStorage.getItem("token");

        if (!userData) {
          alert("User data not found in session storage. Please log in.");
          return;
        }

        setLoading(true);

        const requestData = {
          token,
          user: userData,
          cabinAvaliableModel: {
            startDate,
            endDate: bookingValidity === "multiple_day" ? endDate : null,
            validFrom: bookingValidity === "single_day" ? validFrom : null,
            validTill: bookingValidity === "single_day" ? validTill : null,
            bookingValadity: bookingValidity,
            bookingType:"Booking",
            officeId,
            purpose,
          },
        };

        try {
          const response = await axios.post(`${API_BASE_URL}/cabin/findAvailableCabins`, requestData);
          if (response.data.status === "success") {
            setCabins(response.data.payload);
          } else {
            alert("Failed to fetch cabins: " + response.data.message);
          }
        } catch (error) {
          console.error("Error fetching cabins:", error);
          alert("An error occurred while fetching cabins.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCabins();
  }, [startDate, endDate, validFrom, validTill, purpose, officeId, bookingValidity]);

  const handleCreateBooking = async () => {
    const userData = getUserData();
    const token = sessionStorage.getItem("token");

    if (!userData) {
      alert("User data not found in session storage. Please log in.");
      return;
    }

    if (!selectedCabin) {
      alert("Please select a cabin.");
      return;
    }

    const requestData = {
      token,
      user: userData,
      cabinRequestModel: {
        startDate,
        endDate: bookingValidity === "multiple_day" ? endDate : null,
        validFrom: bookingValidity === "single_day" ? validFrom : null,
        validTill: bookingValidity === "single_day" ? validTill : null,
        bookingValadity: bookingValidity,
        officeId,
        cabinId: selectedCabin,
        bookingType:"Booking",
        purpose,
      },
    };

    console.log("User")
    console.log(requestData);

    try {
      const response = await axios.post(`${API_BASE_URL}/user/createBooking`, requestData);
      if (response.data.status === "success") {
        alert("Booking created successfully!");
      } else {
        alert("Failed to create booking: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking.");
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
    <div className="container mt-5">
      <h3 className="text-center mb-4">Cabin Booking</h3>
      <div className="card shadow-sm p-4">
        <form>
          <div className="mb-3">
            <label className="form-label">Booking Validity</label>
            <select
              className="form-select"
              value={bookingValidity}
              onChange={(e) => setBookingValidity(e.target.value)}
            >
              <option value="single_day">Single Day</option>
              <option value="multiple_day">Multiple Day</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {bookingValidity === "multiple_day" && (
            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          {bookingValidity === "single_day" && (
            <>
              <div className="mb-3">
                <label className="form-label">Valid From</label>
                <input
                  type="time"
                  className="form-control"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Valid Till</label>
                <input
                  type="time"
                  className="form-control"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Purpose</label>
            <input
              type="text"
              className="form-control"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Enter booking purpose"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Office ID</label>
            <select
              className="form-select"
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
            >
              <option value="CIT">CIT</option>
              <option value="YIT">YIT</option>
              <option value="BTC">BTC</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Cabin</label>
            {loading ? (
              <p>Loading cabins...</p>
            ) : (
              <select
                className="form-select"
                value={selectedCabin}
                onChange={(e) => setSelectedCabin(e.target.value)}
                disabled={cabins.length === 0}
              >
                <option value="">Select a Cabin</option>
                {cabins.map((cabin) => (
                  <option
                    key={cabin.cabinId}
                    value={cabin.cabinId}
                    disabled={cabin.status === "Booked"}
                  >
                    {cabin.cabinName} - Capacity: {cabin.capacity} 
                    <span className={getStatusColor(cabin.status)}>
                      {" - Status: " + cabin.msg}
                    </span>
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            className="btn btn-success w-100"
            onClick={handleCreateBooking}
            disabled={!selectedCabin}
          >
            Create Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default CabinRequest;
