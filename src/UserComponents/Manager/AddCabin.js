import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';
import API_BASE_URL from '../Config/Config';

const AddCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [newCabin, setNewCabin] = useState({
    cabinName: '',
    capacity: '',
    bookingType: '',
    appliances:'',
    status: 'Select Status',
  });
  const [error, setError] = useState('');
  const [file, setFile] = useState(null); 
  const fileInputRef = useRef(null);
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index === null) {
      setNewCabin((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      const updatedCabins = cabins.map((cabin, i) =>
        i === index ? { ...cabin, [name]: value } : cabin
      );
      setCabins(updatedCabins);
    }
  };

  const handleAutoAddRow = () => {
    if (
      !newCabin.cabinName ||
      !newCabin.capacity ||
      !newCabin.bookingType ||
      newCabin.status === 'Select Status'
    ) {
      return; 
    }

    const isRowExist = cabins.some(
      (cabin) =>
        cabin.cabinName === newCabin.cabinName &&
        cabin.capacity === newCabin.capacity &&
        cabin.bookingType === newCabin.bookingType &&
        cabin.bookingType === newCabin.appliances &&
        cabin.status === newCabin.status
    );

    if (!isRowExist) {
      setCabins([...cabins, newCabin]);
      setNewCabin({
        cabinName: '',
        capacity: '',
        bookingType: '',
        appliances:'',
        status: 'Select Status',
      });
      setError('');
    }
  };

  const handleRemoveRow = (index) => {
    const updatedCabins = cabins.filter((_, i) => i !== index);
    setCabins(updatedCabins);
  };

  const handleDownload = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cabin/download/format`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Cabin Details.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};


  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
  
    setFile(uploadedFile);
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  

      const processedData = jsonData.map((row) => {
        const bookingType =
          row["Booking Validity"]?.toLowerCase().includes("single")
            ? "single_day"
            : row["Booking Validity"]?.toLowerCase().includes("multiple")
            ? "multiple_day"
            : "";
  
        const status =
          bookingType === "multiple_day" &&
          row["Status"]?.toLowerCase() === "reserved"
            ? "Select Status"
            : row["Status"];
  
        return {
          cabinName: row["Cabin Name"] || "",
          capacity: row["Capacity"] || "",
          appliances: row["Appliances"] || "",
          bookingType,
          status,
        };
      });
  
      setCabins((prevCabins) => [...prevCabins, ...processedData]);
    };
  
    reader.readAsArrayBuffer(uploadedFile);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  

  // Handle Clear all data
  const handleClear = () => {
    setFile(null); // Clear file
    setCabins([]); // Clear cabin data
    setError(""); // Clear errors
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  
  const handleSubmit = () => {
    const validCabins = cabins.filter(
      (cabin) =>
        cabin.cabinName &&
        cabin.capacity &&
        cabin.bookingType &&
        cabin.appliances &&
        cabin.status !== 'Select Status'
    );

    if (validCabins.length === 0) {
      setError('Please add at least one valid cabin.');
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    const payload = {
      token: token,
      user: userData,
      cabin: validCabins, 
    };

    axios
      .post(`${API_BASE_URL}/manager/addCabin`, payload)
      .then((response) => {
        console.log('Cabins added successfully:', response);
        alert('Cabins added successfully!');
        setCabins([]);
      })
      .catch((error) => {
        console.error('Error adding cabins:', error);
        alert('Failed to add cabins. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2 className="my-4">Create Cabins</h2>
    
    
      <div className="d-flex justify-content-end mb-3">
    
      <button c className="btn btn-primary me-2" onClick={handleDownload}>
          Download Format
        </button>

        <button
          className="btn btn-primary me-2"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={!!file}
        >
          Upload
        </button>
       
          <button className="btn btn-secondary me-2" onClick={handleClear}>
            Clear
          </button>
        
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        accept=".xlsx,.xls,.csv" // Restrict file types
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Cabin Name</th>
            <th>Capacity</th>
            <th>Booking Type</th>
            <th>Appliance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="cabinName"
                  value={cabin.cabinName}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="capacity"
                  value={cabin.capacity}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>
              <td>
                <select
                  name="bookingType"
                  value={cabin.bookingType}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                >
                  <option value="">Select Type</option>
                  <option value="single_day">Single Day</option>
                  <option value="multiple_day">Multiple Day</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  name="appliances"
                  value={cabin.appliances}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>
              <td>
                <select
                  name="status"
                  value={cabin.status}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                >
                  <option value="Select Status">Select Status</option>
                  <option value="Available">Available</option>
                  {cabin.bookingType === "single_day" && <option value="Reserved">Reserved</option>}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveRow(index)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                name="cabinName"
                value={newCabin.cabinName}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Cabin Name"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td>
              <input
                type="number"
                name="capacity"
                value={newCabin.capacity}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Capacity"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td>
              <select
                name="bookingType"
                value={newCabin.bookingType}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                onBlur={handleAutoAddRow}
              >
                <option value="">Select Type</option>
                <option value="single_day">Single Day</option>
                <option value="multiple_day">Multiple Day</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                name="appliances"
                value={newCabin.appliances}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Appliances"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td>
              <select
                name="status"
                value={newCabin.status}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                onBlur={handleAutoAddRow}
              >
                <option value="Select Status">Select Status</option>
                <option value="Available">Available</option>
                {newCabin.bookingType === "single_day" && <option value="Reserved">Reserved</option>}
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AddCabin;
