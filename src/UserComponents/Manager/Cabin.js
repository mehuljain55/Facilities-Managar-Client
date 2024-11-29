import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddCabin from './AddCabin';
import EditCabin from './EditCabin';

const MenuBar = ({ setActiveComponent }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Cabin Manager</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setActiveComponent('AddCabin')}>Add Cabin</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setActiveComponent('EditCabin')}>Edit Cabin</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


const Cabin = () => {
  const [activeComponent, setActiveComponent] = useState('AddCabin');

  return (
    <div>
      <MenuBar setActiveComponent={setActiveComponent} />
      {activeComponent === 'AddCabin' && <AddCabin />}
      {activeComponent === 'EditCabin' && <EditCabin />}
    </div>
  );
};

export default Cabin;