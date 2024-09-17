import React, { useState, useEffect } from 'react';

// Fonction pour calculer la distance entre deux points GPS (en mètres)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance en mètres
  return distance;
}

const App = () => {
  const [position, setPosition] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Adresses sensibles avec latitude, longitude et rayon (en mètres)
  const sensitiveAreas = [
    {
      neighborhood: "Blosne",
      streets: [
        { name: "Place du Banat", latitude: 48.0855, longitude: -1.6756 },
        { name: "Rue de Suisse", latitude: 48.0851, longitude: -1.6732 },
        { name: "Rue de Hongrie", latitude: 48.0836, longitude: -1.6715 },
        { name: "Avenue Henri Fréville", latitude: 48.0841, longitude: -1.6760 },
        { name: "Rue de Bosnie", latitude: 48.0860, longitude: -1.6774 }
      ]
    },
    {
      neighborhood: "Maurepas",
      streets: [
        { name: "Rue du Gast", latitude: 48.1245, longitude: -1.6659 },
        { name: "Boulevard Paul Painlevé", latitude: 48.1261, longitude: -1.6637 },
        { name: "Rue d’Antrain", latitude: 48.1234, longitude: -1.6612 },
        { name: "Avenue Gros Malhon", latitude: 48.1250, longitude: -1.6601 },
        { name: "Rue de Fougères", latitude: 48.1281, longitude: -1.6664 }
      ]
    },
    {
      neighborhood: "Villejean",
      streets: [
        { name: "Rue du Bourbonnais", latitude: 48.1198, longitude: -1.7050 },
        { name: "Rue de Fougères", latitude: 48.1222, longitude: -1.7055 },
        { name: "Boulevard de Verdun", latitude: 48.1200, longitude: -1.7060 },
        { name: "Rue de Brest", latitude: 48.1193, longitude: -1.7070 },
        { name: "Rue de Lorraine", latitude: 48.1212, longitude: -1.7044 }
      ]
    },
    {
      neighborhood: "Triangle",
      streets: [
        { name: "Station de métro Triangle", latitude: 48.0834, longitude: -1.6735 },
        { name: "Rue des Iles", latitude: 48.0825, longitude: -1.6745 }
      ]
    },
    {
      neighborhood: "Chantepie",
      streets: [
        { name: "Rue de Vern", latitude: 48.0946, longitude: -1.6610 },
        { name: "Avenue de la Bourdonnière", latitude: 48.0943, longitude: -1.6600 },
        { name: "Station de métro Henri Fréville", latitude: 48.0841, longitude: -1.6760 }
      ]
    }
  ];

  useEffect(() => {
    // Fonction pour obtenir la position actuelle
    const getCurrentPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition({ latitude, longitude });
            checkProximity(latitude, longitude);
          },
          (error) => {
            console.error("Erreur de géolocalisation :", error);
          }
        );
      } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
      }
    };

    // Vérification de la proximité avec les zones sensibles
    const checkProximity = (userLat, userLon) => {
      sensitiveAreas.forEach((area) => {
        area.streets.forEach((street) => {
          const distance = calculateDistance(userLat, userLon, street.latitude, street.longitude);
          if (distance < 200) {
            setAlertMessage(`Vous êtes proche de la rue sensible : ${street.name} dans le quartier ${area.neighborhood}`);
          }
        });
      });
    };

    // Appeler la fonction pour obtenir la position actuelle
    getCurrentPosition();

    // Optionnel : Mettre à jour la position toutes les 30 secondes
    const interval = setInterval(() => {
      getCurrentPosition();
    }, 30000);

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [sensitiveAreas]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Application d'alerte de zones sensibles</h1>
      {position ? (
        <div>
          <p>Votre position actuelle est :</p>
          <ul>
            <li>Latitude : {position.latitude}</li>
            <li>Longitude : {position.longitude}</li>
          </ul>
        </div>
      ) : (
        <p>Obtention de la position en cours...</p>
      )}
      {alertMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'red', color: 'white' }}>
          <strong>{alertMessage}</strong>
        </div>
      )}
    </div>
  );
};

export default App;
