import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LoginS() {
  // Déclaration des états pour les champs email, mot de passe et fonction
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fonction: ''
  });

  // Fonction pour mettre à jour les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer l'authentification de l'utilisateur
    console.log('Login Attempt:', formData);
    // Vous pouvez ajouter ici l'appel à une API d'authentification
  };

  return (
    <div className="container mt-4">
      <h2>Login Form</h2>
      <Form onSubmit={handleSubmit}>
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

        {/* Champ pour la fonction */}
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
    </div>
  );
}

export default LoginS;
