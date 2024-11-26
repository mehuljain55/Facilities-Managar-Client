import React from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const StatusResponse = ({
  status = "info",
  message = "No message provided.",
  onClose,
}) => {
  // Define icon and color for each status
  const statusDetails = {
    success: { icon: <FaCheckCircle />, color: "green" },
    failed: { icon: <FaTimesCircle />, color: "red" },
    unauthorized: { icon: <FaExclamationCircle />, color: "orange" },
    not_found: { icon: <FaExclamationCircle />, color: "gray" },
    not_available: { icon: <FaExclamationCircle />, color: "gray" },
    authorized: { icon: <FaCheckCircle />, color: "blue" },
    available: { icon: <FaCheckCircle />, color: "blue" },
    info: { icon: <FaInfoCircle />, color: "blue" },
  };

  const { icon, color } = statusDetails[status] || statusDetails["info"];

  return (
    <div
      className="d-flex align-items-center justify-content-between border p-3 rounded mb-3"
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="d-flex align-items-center">
        <span style={{ color, fontSize: "24px", marginRight: "10px" }}>{icon}</span>
        <div>
          <strong style={{ color }}>{status.toUpperCase()}</strong>
          <p className="m-0 text-secondary">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          className="btn-close"
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            color: "#333",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

// Define prop types for validation
StatusResponse.propTypes = {
  status: PropTypes.oneOf([
    "success",
    "failed",
    "unauthorized",
    "not_found",
    "not_available",
    "authorized",
    "available",
    "info",
  ]),
  message: PropTypes.string,
  onClose: PropTypes.func, // Function to handle close button click
};

// Default props
StatusResponse.defaultProps = {
  status: "info",
  message: "No message provided.",
  onClose: null,
};

export default StatusResponse;
