import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

function profile () {
  const [image, setImage] = useState(null); // Pour stocker l'image téléchargée
  const [imagePreview, setImagePreview] = useState(null); // Pour l'aperçu de l'image
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    politicalParty: '',
  });

  // Fonction pour gérer la sélection d'une image
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Récupérer le premier fichier sélectionné
    if (file) {
      setImage(file);

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Mettre à jour l'aperçu de l'image
      };
      reader.readAsDataURL(file); // Lire le fichier en base64
    }
  };

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (image) {
      console.log('Nom:', formData.firstName);
      console.log('Prénom:', formData.lastName);
      console.log('Parti politique:', formData.politicalParty);
      console.log('Fichier sélectionné:', image);
      // Vous pouvez envoyer ces données à un serveur ici
    } else {
      console.log('Aucune image sélectionnée.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Formulaire de Téléchargement de Photo et Informations</h2>

      <Form onSubmit={handleSubmit}>
        {/* Champ Nom */}
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

        {/* Champ Prénom */}
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

        {/* Champ Parti politique */}
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

        {/* Champ de sélection d'image */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choisir une photo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        {/* Aperçu de l'image téléchargée */}
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

        {/* Texte d'information pour l'utilisateur */}
        <Form.Text muted>
          Veuillez télécharger une image de moins de 5 Mo.
        </Form.Text>

        {/* Bouton de soumission */}
        <Button variant="primary" type="submit" className="mt-3">
          Soumettre
        </Button>
      </Form>
    </div>
  );
}

export default profile;
