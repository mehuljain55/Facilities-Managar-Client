import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js'; // Import fuse.js for fuzzy searching
import API_BASE_URL from '../Config/Config';

const AddCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [newCabin, setNewCabin] = useState({
    cabinName: '',
    capacity: '',
    bookingType: '',
    appliances:'',
    status: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [file, setFile] = useState(null); 
  const fileInputRef = useRef(null);
  const VALID_STATUSES = ['Available', 'Reserved'];

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

  useEffect(() => {
    handleAddRow();
  }, []);

  const handleAddRow = () => {
    setCabins([...cabins, {
      cabinName: '',
      capacity: '',
      bookingType: '',
      appliances: '',
      status: '',
    }]);
  };

  const validateCabins = () => {
    const errors = cabins.map((cabin) => {
      const rowErrors = {};
      if (!cabin.cabinName) rowErrors.cabinName = true;
      if (!cabin.capacity) rowErrors.capacity = true;
      if (!cabin.bookingType) rowErrors.bookingType = true;
      if (!cabin.appliances) rowErrors.appliances = true;
      if (cabin.status === '') rowErrors.status = true;
      return rowErrors;
    });
    setValidationErrors(errors);
    return errors.every((row) => Object.keys(row).length === 0);
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

// Initialize fuse.js with valid statuses and configuration
const fuse = new Fuse(VALID_STATUSES, {
  threshold: 0.3, // Adjust threshold for tolerance (lower means stricter match)
  includeScore: true
});

const normalizeStatus = (status, bookingType) => {
  const normalized = status?.toLowerCase().trim();

  // If booking type is 'multiple_day', do not allow 'reserved' status
  if (bookingType === 'multiple_day' && normalized === 'reserved') {
    return { status: '', valid: false }; // Invalid status
  }

  // Perform fuzzy search using fuse.js
  const result = fuse.search(normalized);

  // If a match is found and the score is acceptable (lower score means closer match)
  if (result.length > 0 && result[0].score < 0.3) {
    return { status: result[0].item, valid: true }; 
  } else {
    return { status: '', valid: true };
  }
};

const handleFileUpload = (event) => {
  const uploadedFile = event.target.files[0];
  if (!uploadedFile) return;

  setFile(uploadedFile);
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const processedData = jsonData.map((row) => {
      // Normalize Booking Validity to 'single_day' or 'multiple_day'
      const bookingType =
        row['Booking Validity']?.toLowerCase().includes('single')
          ? 'single_day'
          : row['Booking Validity']?.toLowerCase().includes('multiple')
          ? 'multiple_day'
          : '';

      // Normalize Status using fuzzy matching
      const { status, valid } = normalizeStatus(row['Status'], bookingType);

    
      return {
        cabinName: row['Cabin Name'] || '',
        capacity: row['Capacity'] || '',
        appliances: row['Appliances'] || '',
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


  const handleClear = () => {
    setFile(null);
    setCabins([]);
    setError("");
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = () => {

    if (!validateCabins()) {
      setError('Please correct the highlighted errors.');
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    const payload = {
      token: token,
      user: userData,
      cabin: cabins,
    };

    axios
      .post(`${API_BASE_URL}/manager/addCabin`, payload)
      .then((response) => {
        console.log('Cabins added successfully:', response);
        alert('Cabins added successfully!');
        setCabins([]);
        setError("");
        setValidationErrors([]);
      })
      .catch((error) => {
        console.error('Error adding cabins:', error);
        alert('Failed to add cabins. Please try again.');
      }
    );
  };

  return (
    <div className="container">
      <h2 className="my-4">Create Cabins</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary me-2" onClick={handleDownload}>
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
        accept=".xlsx,.xls,.csv"
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
                  placeholder="Cabin Name"
                  value={cabin.cabinName}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`form-control ${validationErrors[index]?.cabinName ? 'is-invalid' : ''}`}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="capacity"
                   placeholder="Capacity"
                  value={cabin.capacity}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`form-control ${validationErrors[index]?.capacity ? 'is-invalid' : ''}`}
                />
              </td>
              <td>
                <select
                  name="bookingType"
                  value={cabin.bookingType}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`form-control ${validationErrors[index]?.bookingType ? 'is-invalid' : ''}`}
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
                  placeholder="Appliance"
                  value={cabin.appliances}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`form-control ${validationErrors[index]?.appliances ? 'is-invalid' : ''}`}
                />
              </td>
              <td>
                <select
                  name="status"
                  value={cabin.status}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`form-control ${validationErrors[index]?.status ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Status</option>
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
        </tbody>
      </table>

      <div className="d-flex justify-content-center py-3">
  <button className="btn btn-success mx-2" onClick={handleAddRow}>
    Add Row
  </button>
  <button className="btn btn-primary mx-2" onClick={handleSubmit}>
    Submit
  </button>
</div>

    </div>
  );
};

export default AddCabin;
