import React from 'react';

const MenuBar = ({ setActiveComponent, activeComponent }) => {
  // Define styles as JavaScript objects
  const buttonStyles = {
    base: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      marginRight: '10px',
      fontWeight: 'bold',
    },
    active: {
      backgroundColor: 'darkblue',
      color: 'white',
    },
    inactive: {
      backgroundColor: 'lightblue',
      color: 'white',
    },
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Cabin Manager
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                style={{
                  ...buttonStyles.base,
                  ...(activeComponent === 'AddCabin'
                    ? buttonStyles.active
                    : buttonStyles.inactive),
                }}
                onClick={() => setActiveComponent('AddCabin')}
              >
                Add Cabin
              </button>
            </li>
            <li className="nav-item">
              <button
                style={{
                  ...buttonStyles.base,
                  ...(activeComponent === 'EditCabin'
                    ? buttonStyles.active
                    : buttonStyles.inactive),
                }}
                onClick={() => setActiveComponent('EditCabin')}
              >
                Edit Cabin
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
