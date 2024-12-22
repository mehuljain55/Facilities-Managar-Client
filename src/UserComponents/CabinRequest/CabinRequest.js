import React, { useState, useEffect } from "react";
import API_BASE_URL from "../Config/Config";
import axios from "axios";
import CustomTimePicker from "../TimePicker/CustomTimePicker";


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
  const [duration, setDuration] = useState("");
  const[validTime,setValidTime]= useState(false);
  const[selectedCabinData,setSelectedCabinData]=useState("");
 

  const getUserData = () => {
    const storedData = sessionStorage.getItem("user");
    return storedData ? JSON.parse(storedData) : null;
  };

   const fetchCabins = async () => {
    setSelectedCabin("");
    setSelectedCabinData(""); 
    setCabins([]);
  
    if(!validTime &&  bookingValidity === "single_day")
        {
          console.log("Invalid time range");
          return;
        }
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


  useEffect(() => {
    fetchCabins();
  }, [startDate, endDate, validFrom, validTime,validTill, purpose, officeId, bookingValidity]);

  const handleCabinChange = (e) => {
    const selectedCabinId = e.target.value;
    setSelectedCabin(selectedCabinId);

    // Log selectedCabinId and cabins for debugging
    console.log("Selected Cabin ID: ", selectedCabinId);
    console.log("Cabins Array: ", cabins);

    // Find the selected cabin object
    const selectedCabinObj = cabins.find((cabin) => String(cabin.cabinId) === selectedCabinId); // Ensure both are strings
    console.log("Selected Cabin Object: ", selectedCabinObj);

    if (selectedCabinObj) {
      setSelectedCabinData(selectedCabinObj.appliances || "");
    } else {
      setSelectedCabinData(""); // Reset if no valid selection
    }
  };


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

    if(!validTime &&  bookingValidity === "single_day")
    {
      alert("Invalid time range");
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
    console.log(selectedCabinData);

    try {
      const response = await axios.post(`${API_BASE_URL}/user/createBooking`, requestData);
      if (response.data.status === "success") {
        alert("Booking created successfully!");
        setSelectedCabin("");
        setCabins([]);    
        setPurpose("");
        setSelectedCabinData(""); 
      } else {
        alert("Failed to create booking: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking.");
    }
  };

 

  const calculateDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  };

  useEffect(() => {
    const calculatedDuration = calculateDuration(validFrom, validTill);
    setDuration(calculatedDuration);
    if(validTill <= validFrom )
    {
      setValidTime(false);
    }else{
      setValidTime(true);
    }

  }, [validFrom, validTill]);



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
                <label className="form-label">Start Time</label>
                <CustomTimePicker
                  value={validFrom}
                  onChange={(time) => {
                    setValidFrom(time);
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">End Time</label>
                <CustomTimePicker
                  value={validTill}
                  onChange={(time) => {
                    if (validFrom && time > validFrom) {
                      setValidTill(time);
                    } else {
                      alert("End time must be greater than start time.");
                      setValidTill(time);
                    }
                  }}
                />
              </div>
              {validFrom && validTill && validTill <= validFrom && (
                <p className="text-danger">End time must be later than start time.</p>
              )}
              <div className="mb-3">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  value={duration}
                  placeholder="Enter booking purpose"
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
                onChange={handleCabinChange}
                disabled={cabins.length === 0}
              >
                <option value="">Select a Cabin</option>
                {cabins.map((cabin) => (
                  <option
                    key={cabin.cabinId}
                    value={cabin.cabinId}
                    disabled={cabin.status === "Booked" || cabin.status === "Reserved"}
                  >
                    {cabin.cabinName} - Capacity: {cabin.capacity} - Status: {cabin.status}
                  </option>
                ))}
              </select>
            )}
          </div>
  
          <div className="mt-3">
            <label htmlFor="appliances" className="form-label">Appliances</label>
            <input
              type="text"
              id="appliances"
              className="form-control"
              value={selectedCabinData}
              readOnly
            />
          </div>
  
          <button
            type="button"
            className="btn btn-success w-100 mt-4" // Added margin-top to space out from previous field
            onClick={handleCreateBooking}
            disabled={!selectedCabin}
          >
            Create Booking
          </button>
        </form>
      </div>
    </div>
  );
}  
export default CabinRequest;
