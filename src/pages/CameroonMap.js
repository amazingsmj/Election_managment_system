import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
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
  const [currentGeoData, setCurrentGeoData] = useState(cameroonGeoData);
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.3697, 12.3547]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapHistory, setMapHistory] = useState([]);
  const [viewLevel, setViewLevel] = useState('country');
  const mapRef = useRef(null);

  // Fonction pour déterminer la couleur en fonction des résultats électoraux
  const getColor = (region) => {
    const result = electionResults.find(r => r.region === region);
    return result ? result.winningPartyColor : ''; // Retourne la couleur du parti gagnant ou une couleur par défaut
  };

  const style = (feature) => {
    return {
      fillColor: getColor(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.NAME_1;
    const departmentName = feature.properties.NAME_2;
    const arrondissementName = feature.properties.NAME_3;

    layer.bindTooltip(
      viewLevel === 'department' ? `<strong>${departmentName}</strong>` :
      viewLevel === 'arrondissement' ? `<strong>${arrondissementName}</strong>` :
      viewLevel === 'region' ? `<strong>${regionName}</strong>` :
      `<strong>${regionName}</strong>`,
      { permanent: false, direction: 'right' }
    );

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: async (e) => {
        if (viewLevel === 'country') {
          try {
            const regionData = await import(`./Departements/${regionName}.json`);
            updateMapState(regionData.default, e.target, 'region', 8);
          } catch (error) {
            console.error(`Échec du chargement des données pour ${regionName} :`, error);
          }
        } else if (viewLevel === 'region') {
          const departmentData = arrondissementsData.features.filter(
            f => f.properties.NAME_1 === regionName && f.properties.NAME_2 === departmentName
          );
          updateMapState({ type: "FeatureCollection", features: departmentData }, e.target, 'department', 10);
        } else if (viewLevel === 'department') {
          const arrondissementData = {
            type: "FeatureCollection",
            features: [feature]
          };
          updateMapState(arrondissementData, e.target, 'arrondissement', 12);
        }
      }
    });
  };

  const updateMapState = (newData, layer, newViewLevel, newZoom) => {
    const currentCenter = mapRef.current.getCenter();
    setMapHistory(prev => [...prev, {
      data: currentGeoData,
      zoom: mapZoom,
      viewLevel,
      bounds: mapBounds,
      center: [currentCenter.lat, currentCenter.lng]
    }]);
    setCurrentGeoData(newData);
    const bounds = layer.getBounds();
    setMapBounds(bounds);
    setMapCenter(bounds.getCenter());
    setMapZoom(newZoom);
    setViewLevel(newViewLevel);
  };

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
        {/* Ajout de la couche OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          key={JSON.stringify(currentGeoData)}
          data={currentGeoData}
          style={style}
          onEachFeature={onEachFeature}
        />
        <MapUpdater bounds={mapBounds} zoom={mapZoom} center={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default Dashboard;
