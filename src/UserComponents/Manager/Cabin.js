import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import AddCabin from './AddCabin';
import EditCabin from './EditCabin';

const Cabin = () => {
  const [activeComponent, setActiveComponent] = useState('AddCabin');

  return (
    <div>
      <MenuBar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      {activeComponent === 'AddCabin' && <AddCabin />}
      {activeComponent === 'EditCabin' && <EditCabin />}
    </div>
  );
};

export default Cabin;
