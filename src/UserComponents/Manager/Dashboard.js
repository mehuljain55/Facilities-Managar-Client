import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import API_BASE_URL from "../Config/Config";

import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ activeSection }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const token = sessionStorage.getItem("token");

      if (!user || !token) {
        alert("User not authenticated");
        return;
      }

      const userRequest = {
        token: token,
        user: user,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/manager/officeRequestSummary`,
          userRequest,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status === "success") {
          setUserData(response.data.payload);
         
        } else {
          alert("Failed to fetch booking requests");
        }
      } catch (err) {
        alert("Error fetching booking requests");
      }
    };

    fetchData();
  }, []);

  console.log("user data",userData);

  const ActionMark = ({ show }) => {
    return show ? (
      <Badge
        pill
        bg="danger"
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "1.2rem", // Make the badge larger
          padding: "0.5rem 1rem",
          borderRadius: "50%",
        }}
      >
        !
      </Badge>
    ) : null;
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Manager Dashboard</h1>
      <Row className="g-4">
        <Col md={4}>
          <Card bg="primary" text="white" className="text-center" style={{ position: "relative" }}>
            <ActionMark show={userData.cabinRequestHold > 0} />
            <Card.Body
              style={{ cursor: "pointer" }}
              onClick={() => activeSection("approveRequest")}
            >
              <Card.Title>
                <FaHourglassHalf size={30} /> Cabin Requests on Hold
              </Card.Title>
              <Card.Text>{userData.cabinRequestHold}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="success" text="white" className="text-center">
            <Card.Body
              style={{ cursor: "pointer" }}
              onClick={() => activeSection("viewAllCabinRequestApproved")}
            >
              <Card.Title>
                <FaCheckCircle size={30} /> Cabin Requests Approved
              </Card.Title>
              <Card.Text>{userData.cabinRequestApproved}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="danger" text="white" className="text-center">
            <Card.Body
              style={{ cursor: "pointer" }}
              onClick={() => activeSection("viewAllCabinRequestRejected")}
            >
              <Card.Title>
                <FaTimesCircle size={30} /> Cabin Requests Rejected
              </Card.Title>
              <Card.Text>{userData.cabinRequestRejected}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="warning" text="dark" className="text-center" style={{ position: "relative" }}>
            <ActionMark show={userData.userRequestPending > 0} />
            <Card.Body
              style={{ cursor: "pointer" }}
              onClick={() => activeSection("approveUserRequest")}
            >
              <Card.Title>
                <FaHourglassHalf size={30} /> User Requests Pending
              </Card.Title>
              <Card.Text>{userData.userRequestPending}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="info" text="white" className="text-center">
            <Card.Body style={{ cursor: "pointer" }}>
              <Card.Title>
                <FaCheckCircle size={30} /> User Requests Approved
              </Card.Title>
              <Card.Text>{userData.userRequestApproved}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="primary" text="white" className="text-center">
            <Card.Body
              style={{ cursor: "pointer" }}
              onClick={() => activeSection("todaysBooking")}
            >
              <Card.Title>
                <FaHourglassHalf size={30} /> Today Booking
              </Card.Title>
              <Card.Text>{userData.todaysCabinBooking}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
