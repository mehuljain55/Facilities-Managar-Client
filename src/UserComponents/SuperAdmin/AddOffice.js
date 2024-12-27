import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../Config/Config';

const AddOffice = () => {
  const [offices, setOffices] = useState([]);
  const [newOffice, setNewOffice] = useState({
    officeId: '',
    officeName: '',
    address: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index === null) {
      // Update the newOffice state
      setNewOffice((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      // Update the offices array
      const updatedOffice = offices.map((office, i) =>
        i === index ? { ...office, [name]: value } : office
      );
      setOffices(updatedOffice);
    }
  };

  const handleAutoAddRow = () => {
    if (!newOffice.officeId || !newOffice.officeName || !newOffice.address) {
      return; // Prevent adding a row if any field is empty
    }

    const isRowExist = offices.some(
      (office) =>
        office.officeId === newOffice.officeId &&
        office.officeName === newOffice.officeName &&
        office.address === newOffice.address
    );

    if (!isRowExist) {
      setOffices([...offices, newOffice]);
      setNewOffice({
        officeId: '',
        officeName: '',
        address: '',
      });
      setError('');
    }
  };

  const handleRemoveRow = (index) => {
    const updatedOffice = offices.filter((_, i) => i !== index);
    setOffices(updatedOffice);
  };

  const handleSubmit = () => {
    const validOffice = offices.filter(
      (office) => office.officeId && office.officeName && office.address
    );

    if (validOffice.length === 0) {
      setError('Please add at least one valid office.');
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    const officeModel = {
      token: token,
      user: userData,
      offices: validOffice,
    };

    axios
      .post(`${API_BASE_URL}/office/add`, officeModel)
      .then((response) => {
        alert('Status: ' + response.data.message);
        setOffices([]); // Clear the offices after successful submission
      })
      .catch((error) => {
        console.error('Error adding offices:', error);
        alert('Failed to add offices. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2 className="my-4">Create Office</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Office Id</th>
            <th>Office Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="officeId"
                  value={office.officeId}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="officeName"
                  value={office.officeName}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="address"
                  value={office.address}
                  onChange={(e) => handleInputChange(e, index)}
                  className="form-control"
                />
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
                name="officeId"
                value={newOffice.officeId}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Office Id"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td>
              <input
                type="text"
                name="officeName"
                value={newOffice.officeName}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Office Name"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td>
              <input
                type="text"
                name="address"
                value={newOffice.address}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Address"
                onBlur={handleAutoAddRow}
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AddOffice;

