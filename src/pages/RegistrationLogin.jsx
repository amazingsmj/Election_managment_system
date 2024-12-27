import React, { useState } from "react";
import { Form, FloatingLabel, Button, Container, Row, Col } from "react-bootstrap";

const RegistrationLogin = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    region: '',
    department: '',
    arrondissement: '',
    quartier: '',
    phone: '',
    email: '',
    password: '',
    fonction: '',
  });

  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer l'authentification de l'utilisateur
    console.log("Login Attempt:", formData);
    // Vous pouvez ajouter ici l'appel à une API d'authentification
  };

  return (
    <Container className="mt-4" style={loginStyle}>
      <h2>Login Form</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FloatingLabel controlId="floatingFirstName" label="First Name" className="mb-3">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel controlId="floatingLastName" label="Last Name" className="mb-3">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FloatingLabel controlId="floatingRegion" label="Region" className="mb-3">
              <Form.Control
                type="text"
                name="region"
                placeholder="Region"
                value={formData.region}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel controlId="floatingDepartment" label="Department" className="mb-3">
              <Form.Control
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FloatingLabel controlId="floatingArrondissement" label="Arrondissement" className="mb-3">
              <Form.Control
                type="text"
                name="arrondissement"
                placeholder="Arrondissement"
                value={formData.arrondissement}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel controlId="floatingQuartier" label="Quartier" className="mb-3">
              <Form.Control
                type="text"
                name="quartier"
                placeholder="Quartier"
                value={formData.quartier}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FloatingLabel controlId="floatingPhone" label="Phone" className="mb-3">
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>

        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingFunction" label="Function" className="mb-3">
          <Form.Control
            type="text"
            name="fonction"
            placeholder="Your Function"
            value={formData.fonction}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

const loginStyle = {
  maxWidth: "600px",
  margin: "50px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  background: "#f9f9f9",
};

export default RegistrationLogin;
