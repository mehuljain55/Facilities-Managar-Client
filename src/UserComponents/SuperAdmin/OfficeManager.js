import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import AddOffice from './AddOffice';
import EditOffice from './EditOffice';


const OfficeManager = () => {
  const [activeComponent, setActiveComponent] = useState('AddOffice');

  return (
    <div>
      <MenuBar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      {activeComponent === 'AddOffice' && <AddOffice />}
      {activeComponent === 'EditOffice' && <EditOffice />}
    </div>
  );
};

export default OfficeManager;
