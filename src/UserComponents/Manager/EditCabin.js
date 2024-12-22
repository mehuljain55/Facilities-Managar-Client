import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../Config/Config";

const EditCabin = () => {
  const [cabins, setCabins] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = sessionStorage.getItem("token");

      if (!user || !token) {
        alert("User not authenticated");
        return;
      }

      const userRequest = {
        token: token,
        user: user,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/manager/findAllCabinByOffice`,
          userRequest,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status === "success") {
          setCabins(response.data.payload);
          console.log(response.data.payload);
        } else {
          alert("Failed to fetch cabin list");
        }
      } catch (err) {
        alert("Error fetching cabin list");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, cabinId, field) => {
    const value = e.target.value;
    setCabins((prevCabins) =>
      prevCabins.map((cabin) => {
        if (cabin.cabinId === cabinId) {
          if (field === "bookingType" && value === "multiple_day") {
            return { ...cabin, [field]: value, status: "Available" };
          } else {
            return { ...cabin, [field]: value };
          }
        }
        return cabin;
      })
    );
  };

  
  const handleSubmit = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      alert("User not authenticated");
      return;
    }

    const userRequest = {
      token: token,
      user: user,
      cabin: cabins, // Send the entire updated cabins array
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/manager/updateCabin`,
        userRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        alert("Cabins updated successfully!");
      } else {
        alert("Failed to update cabins");
      }
    } catch (err) {
      alert("Error updating cabins");
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Cabin Details</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Cabin ID</th>
            <th>Cabin Name</th>
            <th>Capacity</th>
            <th>Booking Type</th>
            <th>Appliances</th>
         
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin) => (
            <tr key={cabin.cabinId}>
              <td>{cabin.cabinId}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={cabin.cabinName}
                  onChange={(e) =>
                    handleInputChange(e, cabin.cabinId, "cabinName")
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={cabin.capacity}
                  onChange={(e) =>
                    handleInputChange(e, cabin.cabinId, "capacity")
                  }
                />
              </td>
              <td>
                <select
                  className="form-control"
                  value={cabin.bookingType}
                  onChange={(e) =>
                    handleInputChange(e, cabin.cabinId, "bookingType")
                  }
                >
                  <option value="single_day">Single Day</option>
                  <option value="multiple_day">Multiple Day</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={cabin.appliances}
                  onChange={(e) =>
                    handleInputChange(e, cabin.cabinId, "appliances")
                  }
                />
              </td>
              <td>
                
                <select
                  className="form-control"
                  value={cabin.status}
                  onChange={(e) =>
                    handleInputChange(e, cabin.cabinId, "status")
                  }
                  disabled={cabin.bookingType === "multiple_day"}
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Changes
      </button>
    </div>
  );
};

export default EditCabin;
