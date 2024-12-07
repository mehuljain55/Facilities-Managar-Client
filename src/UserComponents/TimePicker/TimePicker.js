import React, { useState } from 'react';

// Helper function to convert 12-hour format to 24-hour format
const convertTo24Hr = (hour, minute, period) => {
  let hour24 = parseInt(hour);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  return `${hour24.toString().padStart(2, '0')}:${minute}`;
};

const TimePicker = ({ label, value, onChange }) => {
  // Default states if no value is passed, or extract from value
  const [hour, setHour] = useState(value ? value.split(':')[0] : "12");
  const [minute, setMinute] = useState(value ? value.split(':')[1].split(' ')[0] : "00");
  const [period, setPeriod] = useState(value ? value.split(' ')[1] : "AM");

  // Hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  
  // Minute options with a 10-minute interval
  const minuteOptions = ["00", "10", "20", "30", "40", "50"];
  
  // AM/PM options
  const periodOptions = ["AM", "PM"];

  const handleSelectChange = () => {
    const convertedTime = convertTo24Hr(hour, minute, period); // Convert to 24-hour format
    onChange(convertedTime);  // Pass the converted time to the parent component
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex">
        {/* Hour Dropdown */}
        <select
          className="form-select w-auto"
          value={hour}
          onChange={(e) => { setHour(e.target.value); }}
          onBlur={handleSelectChange} // Call on change when user blur the input
        >
          {hourOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Colon Separator */}
        <span className="mx-2">:</span>

        {/* Minute Dropdown with 10-min intervals */}
        <select
          className="form-select w-auto"
          value={minute}
          onChange={(e) => { setMinute(e.target.value); }}
          onBlur={handleSelectChange} // Call on change when user blur the input
        >
          {minuteOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Period Dropdown (AM/PM) */}
        <select
          className="form-select w-auto"
          value={period}
          onChange={(e) => { setPeriod(e.target.value); }}
          onBlur={handleSelectChange} // Call on change when user blur the input
        >
          {periodOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimePicker;
