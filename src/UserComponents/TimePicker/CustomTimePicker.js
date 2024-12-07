import React, { useState, useEffect } from "react";

const CustomTimePicker = ({ value, onChange }) => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(":");
      const hourInt = parseInt(hours, 10);
      setSelectedHour(hourInt > 12 ? hourInt - 12 : hourInt || 12);
      setSelectedMinute(parseInt(minutes, 10));
      setPeriod(hourInt >= 12 ? "PM" : "AM");
    } else {
      setSelectedHour(null);
      setSelectedMinute(null);
      setPeriod("");
    }
  }, [value]);

  const handleTimeChange = () => {
    if (selectedHour != null && selectedMinute != null && period) {
      const hour24 =
        period === "PM" && selectedHour !== 12
          ? selectedHour + 12
          : period === "AM" && selectedHour === 12
          ? 0
          : selectedHour;

      const formattedTime = `${hour24.toString().padStart(2, "0")}:${selectedMinute
        .toString()
        .padStart(2, "0")}`;

      onChange(formattedTime); // Send the formatted time to the parent
    }
  };

  useEffect(() => {
    handleTimeChange();
  }, [selectedHour, selectedMinute, period]);

  const generateOptions = (range) =>
    Array.from({ length: range }, (_, i) => i);

  return (
    <div className="d-flex align-items-center">
      <select
        className="form-select me-2"
        value={selectedHour ?? ""}
        onChange={(e) => setSelectedHour(Number(e.target.value))}
      >
        <option value="" disabled>
          hh
        </option>
        {generateOptions(12).map((hour) => (
          <option key={hour + 1} value={hour + 1}>
            {hour + 1}
          </option>
        ))}
      </select>

      <select
        className="form-select me-2"
        value={selectedMinute ?? ""}
        onChange={(e) => setSelectedMinute(Number(e.target.value))}
      >
        <option value="" disabled>
          mm
        </option>
        {generateOptions(60 / 15).map((interval) => (
          <option key={interval * 15} value={interval * 15}>
            {interval * 15}
          </option>
        ))}
      </select>

      <select
        className="form-select"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="" disabled>
          Select
        </option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default CustomTimePicker;