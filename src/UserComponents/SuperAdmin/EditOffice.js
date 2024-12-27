import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../Config/Config";

const EditCabin = () => {
  const [offices, setOffices] = useState([]);


  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/office/findAllOffice`);
      if (response.data.status === "success") {
        setOffices(response.data.payload);
        console.log(response.data.payload);
      } else {
        alert("Failed to fetch office list");
      }
    } catch (err) {
      alert("Error fetching office list");
    }
  };


  useEffect(() => {
  
    fetchData();
  }, []);

  const handleInputChange = (e, officeId, field) => {
    const value = e.target.value;
    setOffices((prevOffices) =>
      prevOffices.map((office) =>
        office.officeId === officeId ? { ...office, [field]: value } : office
      )
    );
  };

  const handleSubmit = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      alert("User not authenticated");
      return;
    }

    const officeModel = {
      token: token,
      user: user,
      offices: offices,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/office/update`,
        officeModel,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        alert("Office updated successfully!");
      } else {
        alert("Failed to update office");
      
      }
    } catch (err) {
      alert("Error updating office");
      console.log(err);
    }finally{
      fetchData();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Office Details</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Office ID</th>
            <th>Office Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office) => (
            <tr key={office.officeId}>
              <td>{office.officeId}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={office.officeName}
                  onChange={(e) =>
                    handleInputChange(e, office.officeId, "officeName")
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={office.address}
                  onChange={(e) =>
                    handleInputChange(e, office.officeId, "address")
                  }
                />
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
