import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

function Profile() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    politicalParty: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      console.log('Nom:', formData.firstName);
      console.log('Prénom:', formData.lastName);
      console.log('Parti politique:', formData.politicalParty);
      console.log('Fichier sélectionné:', image);
    } else {
      console.log('Aucune image sélectionnée.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Formulaire de Téléchargement de Photo et Informations</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Entrez votre nom"
          />
        </Form.Group>
        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Entrez votre prénom"
          />
        </Form.Group>
        <Form.Group controlId="formPoliticalParty" className="mb-3">
          <Form.Label>Parti Politique</Form.Label>
          <Form.Control
            type="text"
            name="politicalParty"
            value={formData.politicalParty}
            onChange={handleInputChange}
            placeholder="Entrez le nom du parti politique"
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choisir une photo</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>
        {imagePreview && (
          <Row className="mb-3">
            <Col>
              <h5>Aperçu :</h5>
              <img
                src={imagePreview}
                alt="Aperçu"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
                className="img-fluid"
              />
            </Col>
          </Row>
        )}
        <Form.Text muted>
          Veuillez télécharger une image de moins de 5 Mo.
        </Form.Text>
        <Button variant="primary" type="submit" className="mt-3">
          Soumettre
        </Button>
      </Form>
    </div>
  );
}

export default Profile;
