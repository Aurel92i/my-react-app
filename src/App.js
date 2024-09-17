import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

// Liste des coordonnées des quartiers sensibles
const sensitiveAreas = [
  { name: 'Blosne', latitude: 48.0796753, longitude: -1.7155472 },
  { name: 'Président Kennedy', latitude: 48.123456, longitude: -1.678901 },
  { name: 'Avenue Patton', latitude: 48.116789, longitude: -1.657123 },
  { name: 'Boulevard du Scorff à Pacé', latitude: 48.13845, longitude: -1.68456 }
];

// Fonction pour calculer la distance entre deux coordonnées (Haversine Formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  return distance;
};

// Fonction pour envoyer l'email d'urgence avec EmailJS
const sendEmergencyEmailViaAPI = (geoPosition) => {
  const templateParams = {
    to_email: 'aurelien.herbin@grdf.fr',
    gps_location: geoPosition,
  };

  emailjs.send('service_crrwqxu', 'template_jn0mlzk', templateParams,'eVoNJE3VFO-dO61kL')
    .then((response) => {
      alert("Email d'urgence envoyé avec succès !");
    }, (error) => {
      alert("Échec de l'envoi de l'email.");
    });
};

// Fonction pour obtenir la géolocalisation
const getGeoLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geoPosition = `${latitude},${longitude}`;
        sendEmergencyEmailViaAPI(geoPosition); // Utiliser EmailJS pour envoyer l'email
      },
      (error) => {
        console.error("Erreur de géolocalisation : ", error);
        alert("Impossible d'obtenir votre position GPS.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
  }
};

const App = () => {
  const [showContacts, setShowContacts] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Fonction pour afficher/masquer les contacts
  const toggleContacts = () => {
    setShowContacts(!showContacts);
  };

  // Fonction pour vérifier la position actuelle et les quartiers sensibles
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });

          // Vérifier si on est proche d'un quartier sensible
          sensitiveAreas.forEach((area) => {
            const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
            if (distance < 0.5) { // 0.5 km = 500 mètres
              setAlertMessage(`Quartier sensible détecté : ${area.name}. Soyez vigilant !`);
            }
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation : ", error);
          alert("Impossible d'obtenir votre position GPS.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Application d'alerte GRDF</h1>

      {/* Message d'alerte de quartier sensible */}
      {alertMessage && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'yellow', color: 'black' }}>
          {alertMessage}
        </div>
      )}

      {/* Bouton pour afficher les contacts */}
      <button 
        style={{ marginBottom: '20px', padding: '10px 20px', fontSize: '16px' }} 
        onClick={toggleContacts}>
        Contacter ma hiérarchie
      </button>

      {/* Affichage conditionnel des contacts */}
      {showContacts && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Contacts Hiérarchiques</h2>
          <ul>
            <li><a href="tel:+33624271929">Christian Oublier (06 24 27 19 29)</a></li>
            <li><a href="tel:+33638992988">Edouard Trebutien (06 38 99 29 88)</a></li>
            <li><a href="tel:+33669041510">Anthony Dapolon (06 69 04 15 10)</a></li>
            <li><a href="tel:+33784100621">Pierre Treff (07 84 10 06 21)</a></li>
          </ul>
        </div>
      )}

      {/* Bouton pour envoyer un email d'urgence */}
      <button 
        style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'red', color: 'white' }} 
        onClick={getGeoLocation}>
        Secours
      </button>
    </div>
  );
};

export default App;
