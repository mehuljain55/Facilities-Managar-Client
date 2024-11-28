import React, { useState } from 'react';
import axios from 'axios';  
import API_BASE_URL from '../Config/Config';

const AddCabin = () => {
  const [cabins, setCabins] = useState([]);
  const [newCabin, setNewCabin] = useState({ cabinId: '', cabinName: '', capacity: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCabin(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddRow = () => {
    if ( !newCabin.cabinName || !newCabin.capacity) {
      setError("All fields are required.");
      return;
    }
    setCabins([...cabins, newCabin]);
    setNewCabin({ cabinId: '', cabinName: '', capacity: '' });
    setError('');
  };

  const handleSubmit = () => {
    if (cabins.length === 0) {
      setError('Please add at least one cabin.');
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    axios.post(`${API_BASE_URL}/manager/addCabin`, {
      token: token,
      user: userData,  
      cabin: cabins,
    })
    .then(response => {
      console.log('Cabins added successfully:', response);
      alert('Cabins added successfully!');
    })
    .catch(error => {
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin, index) => (
            <tr key={index}>
              <td>{cabin.cabinName}</td>
              <td>{cabin.capacity}</td>
              <td>
                <button className="btn btn-danger" onClick={() => {
                  const updatedCabins = cabins.filter((_, i) => i !== index);
                  setCabins(updatedCabins);
                }}>
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
                onChange={handleInputChange}
                className="form-control"
                placeholder="Cabin Name"
              />
            </td>
            <td>
              <input
                type="number"
                name="capacity"
                value={newCabin.capacity}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Capacity"
              />
            </td>
             </tr>
             <button className="btn btn-primary" onClick={handleAddRow}>Add</button>
        </tbody>
      </table>

      <button className="btn btn-success mt-3" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddCabin;