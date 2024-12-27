import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importation des données GeoJSON
import cameroonGeoData from '../component/Cam_GeoData';
import arrondissementsData from '../component/Arrondissements.json';
import electionResults from '../component/electionResults';

// Composant MapUpdater pour gérer les mises à jour de la vue de la carte
function MapUpdater({ bounds, zoom, center }) {
  const map = useMap(); // Accède à l'instance de la carte
  
  useEffect(() => {
    if (bounds) {
      // Si des limites (bounds) sont fournies, ajuste la carte pour inclure ces limites
      map.fitBounds(bounds, {
        padding: [50, 50], // Ajoute un espace autour pour une meilleure visibilité
        maxZoom: zoom      // Définit le niveau de zoom maximum
      });
    } else if (center) {
      // Si seul le centre est fourni, centre la carte sur ce point avec un certain zoom
      map.setView(center, zoom);
    }
  }, [bounds, zoom, center, map]);

  return null; // Ce composant ne rend rien visuellement
}

const Dashboard = () => {
  // États pour gérer les données et l'état de la carte
  const [currentGeoData, setCurrentGeoData] = useState(cameroonGeoData); // Données GeoJSON actuelles
  const [mapBounds, setMapBounds] = useState(null); // Limites actuelles de la carte
  const [mapCenter, setMapCenter] = useState([7.3697, 12.3547]); // Centre initial de la carte (Cameroun)
  const [mapZoom, setMapZoom] = useState(6); // Niveau de zoom initial
  const [mapHistory, setMapHistory] = useState([]); // Historique des états de la carte
  const [viewLevel, setViewLevel] = useState('country'); // Niveau de vue : pays, région, département ou arrondissement
  
  // Référence au conteneur de la carte
  const mapRef = useRef(null);

  // Fonction pour déterminer la couleur en fonction des résultats électoraux
  const getColor = (region) => {
    const result = electionResults.find(r => r.region === region);
    return result ? result.winningPartyColor : ''; // Retourne la couleur du parti gagnant ou une couleur par défaut
  };

  // Fonction pour styliser les entités GeoJSON
  const style = (feature) => {
    return {
      fillColor: getColor(feature.properties.name), // Couleur de remplissage basée sur les résultats
      weight: 2, // Épaisseur des bordures
      opacity: 1, // Opacité des bordures
      color: 'white', // Couleur des bordures
      dashArray: '3', // Style de ligne pointillée
      fillOpacity: 0.7 // Transparence du remplissage
    };
  };

  // Fonction pour gérer les interactions avec chaque entité GeoJSON
  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.NAME_1; // Nom de la région
    const departmentName = feature.properties.NAME_2; // Nom du département
    const arrondissementName = feature.properties.NAME_3; // Nom de l'arrondissement

    // Gère les infobulles en fonction du niveau de vue
    layer.bindTooltip(
      viewLevel === 'department' ? `<strong>${departmentName}</strong>` :
      viewLevel === 'arrondissement' ? `<strong>${arrondissementName}</strong>` :
      viewLevel === 'region' ? `<strong>${regionName}</strong>` :
      `<strong>${regionName}</strong>`,
      { permanent: false, direction: 'right' }
    );

    layer.on({
      mouseover: (e) => {
        // Style survolé
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
        layer.bringToFront(); // Place la couche au premier plan
      },
      mouseout: (e) => {
        // Style par défaut
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: async (e) => {
        // Gestion du clic selon le niveau de vue
        if (viewLevel === 'country') {
          try {
            // Charge dynamiquement les données de la région et met à jour la carte
            const regionData = await import(`./Departements/${regionName}.json`);
            updateMapState(regionData.default, e.target, 'region', 8);
          } catch (error) {
            console.error(`Échec du chargement des données pour ${regionName} :`, error);
          }
        } else if (viewLevel === 'region') {
          // Filtre les données des départements et met à jour la carte
          const departmentData = arrondissementsData.features.filter(
            f => f.properties.NAME_1 === regionName && f.properties.NAME_2 === departmentName
          );
          updateMapState({ type: "FeatureCollection", features: departmentData }, e.target, 'department', 10);
        } else if (viewLevel === 'department') {
          // Charge les données d'un arrondissement et met à jour la carte
          const arrondissementData = {
            type: "FeatureCollection",
            features: [feature]
          };
          updateMapState(arrondissementData, e.target, 'arrondissement', 12);
        }
      }
    });
  };

  // Fonction pour mettre à jour l'état de la carte
  const updateMapState = (newData, layer, newViewLevel, newZoom) => {
    const currentCenter = mapRef.current.getCenter(); // Centre actuel de la carte
    // Ajoute l'état actuel à l'historique
    setMapHistory(prev => [...prev, { 
      data: currentGeoData, 
      zoom: mapZoom, 
      viewLevel, 
      bounds: mapBounds,
      center: [currentCenter.lat, currentCenter.lng]
    }]);
    // Met à jour les données et les paramètres de la carte
    setCurrentGeoData(newData);
    const bounds = layer.getBounds();
    setMapBounds(bounds);
    setMapCenter(bounds.getCenter());
    setMapZoom(newZoom);
    setViewLevel(newViewLevel);
  };

  // Gère le retour à l'état précédent de la carte
  const handleBack = () => {
    if (mapHistory.length > 0) {
      const previousState = mapHistory[mapHistory.length - 1];
      setCurrentGeoData(previousState.data);
      setMapHistory(prev => prev.slice(0, -1));
      setMapBounds(previousState.bounds);
      setMapCenter(previousState.center);
      setMapZoom(previousState.zoom);
      setViewLevel(previousState.viewLevel);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Bouton de retour si l'historique existe */}
      {mapHistory.length > 0 && (
        <button
          onClick={handleBack}
          style={{
            position: 'absolute',
            top: '10px',
            left: '70px',
            zIndex: 1000,
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
      )}
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Rendu des données GeoJSON */}
        <GeoJSON 
          key={JSON.stringify(currentGeoData)}
          data={currentGeoData} 
          style={style}
          onEachFeature={onEachFeature}
        />
        {/* Composant pour gérer les mises à jour de la carte */}
        <MapUpdater bounds={mapBounds} zoom={mapZoom} center={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default Dashboard;
