import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, GeoJSON,TileLayer, useMap } from 'react-leaflet';
// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import GeoJSON data
import cameroonGeoData from './Cam_GeoData.json';
import arrondissementsData from './Arrondissements.json';
import electionResults from './electionResults';

// MapUpdater component to handle map view changes
function MapUpdater({ bounds, zoom, center }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      // If bounds are provided, fit the map to these bounds
      map.fitBounds(bounds, {
        padding: [50, 50], // Add padding for better visibility
        maxZoom: zoom      // Limit the max zoom level
      });
    } else if (center) {
      // If only center is provided, set the view to this center
      map.setView(center, zoom);
    }
  }, [bounds, zoom, center, map]);

  return null; // This component doesn't render anything 
}

const CameroonMap = () => {
  // State management
  const [currentGeoData, setCurrentGeoData] = useState(cameroonGeoData);
  const [mapBounds, setMapBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.3697, 12.3547]);
  const [mapZoom, setMapZoom] = useState(6);                     
  const [mapHistory, setMapHistory] = useState([]);
  const [viewLevel, setViewLevel] = useState('country');
  
  // Reference to the map container
  const mapRef = useRef(null);

  // Function to determine color based on election results
  const getColor = (region) => {
    const result = electionResults.find(r => r.region === region);
    return result ? result.winningPartyColor : '';
  };

  // Style function for GeoJSON features
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

  // Function to handle interactions with each feature
  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.NAME_1;
    const departmentName = feature.properties.NAME_2;
    const arrondissementName = feature.properties.NAME_3;

    // to handle the view level
    layer.bindTooltip(
      viewLevel === 'department' ? `<strong>${arrondissementName}</strong>` :
      viewLevel === 'arrondissement' ? `<strong>${arrondissementName}</strong>` :
      viewLevel === 'region' ? `<strong>${departmentName}</strong>` :
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
            // Load region data and update map
            const regionData = await import(`./Departements/${regionName}.json`);
            updateMapState(regionData.default, e.target, 'region', 8);
          } catch (error) {
            console.error(`Failed to load data for ${regionName}:`, error);
          }
        } else if (viewLevel === 'region') {
          // Filter department data and update map
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

  // to update map state
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

  // Handle back button click
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
      {/* Render back button if there's history */}
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
          ← Back
        </button>
      )}
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
          <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Render GeoJSON data */}
        <GeoJSON 
          key={JSON.stringify(currentGeoData)}
          data={currentGeoData} 
          style={style}
          onEachFeature={onEachFeature}
        />
        {/* Component to handle map updates */}
        <MapUpdater bounds={mapBounds} zoom={mapZoom} center={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default CameroonMap;