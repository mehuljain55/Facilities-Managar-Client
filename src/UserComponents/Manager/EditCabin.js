import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../Config/Config";

const EditCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [updatedCabins, setUpdatedCabins] = useState([]);

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
    setCabins(prevCabins =>
      prevCabins.map(cabin =>
        cabin.cabinId === cabinId ? { ...cabin, [field]: value } : cabin
      )
    );

    setUpdatedCabins(prevUpdatedCabins => {
      const existingCabin = prevUpdatedCabins.find(c => c.cabinId === cabinId);
      if (existingCabin) {
        return prevUpdatedCabins.map(c =>
          c.cabinId === cabinId ? { ...c, [field]: value } : c
        );
      } else {
        const updatedCabin = cabins.find(c => c.cabinId === cabinId);
        return [...prevUpdatedCabins, { ...updatedCabin, [field]: value }];
      }
    });
  };

  const handleSubmit = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    const userRequest = {
      token: token,
      user: user,
      cabin:updatedCabins
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
       alert("Cabins updated");
      } else {
        alert("Failed to update cabin");
      }
    } catch (err) {
      alert("Error updating cabin",err);
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
          </tr>
        </thead>
        <tbody>
          {cabins.map(cabin => (
            <tr key={cabin.cabinId}>
              <td>{cabin.cabinId}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={cabin.cabinName}
                  onChange={e => handleInputChange(e, cabin.cabinId, "cabinName")}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={cabin.capacity}
                  onChange={e => handleInputChange(e, cabin.cabinId, "capacity")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleSubmit}>Submit Changes</button>
    </div>
  );
};

export default EditCabin;