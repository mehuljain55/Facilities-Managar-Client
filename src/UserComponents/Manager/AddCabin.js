import React, { useState } from 'react';
import axios from 'axios';
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
        setCabins([]); // Clear cabins after submission
      })
      .catch((error) => {
        console.error('Error adding cabins:', error);
        alert('Failed to add cabins. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2 className="my-4">Create Cabins</h2>

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
                <select
                  name="status"
                  value={cabin.status}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                >
                  <option value="Select Status">Select Status</option>
                  <option value="Available">Available</option>
                  {cabin.bookingType === 'single_day' && <option value="Reserved">Reserved</option>}
                </select>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleRemoveRow(index)}>
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
                {newCabin.bookingType === 'single_day' && <option value="Reserved">Reserved</option>}
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
