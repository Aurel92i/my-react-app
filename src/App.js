import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import './App.css'; // Assure-toi que le CSS est bien lié


// Liste des coordonnées des quartiers sensibles
const sensitiveAreas = [
  { name: 'Villejean - Rue du Bourbonnais', latitude: 48.1205708, longitude: -1.7104573 },
  { name: 'Villejean - Rue de Lorraine', latitude: 48.124280, longitude: -1.703960 },
  { name: 'Villejean - Cr du Président John Fitzgerald Kennedy', latitude: 48.125256, longitude: -1.707970 },
  { name: 'Villejean - Boulevard Paul Painlevé', latitude: 48.125350, longitude: -1.705955 },
  { name: 'Blosne - Place du Banat', latitude: 48.085040, longitude: -1.652799 },
  { name: 'Blosne - Avenue Henri Fréville', latitude: 48.087456, longitude: -1.660870 },
  { name: 'Cleunay - Champion de Cissé', latitude: 48.101239, longitude: -1.687147 },
  { name: 'Cleunay - Rue Jules Lallemand', latitude: 48.099960, longitude: -1.684347 },
  { name: 'Maurepas - Allée du BINGO', latitude: 48.124367, longitude: -1.666417 },
  { name: 'Maurepas - Rue du Gast', latitude: 48.125789, longitude: -1.671407 },
  { name: 'Maurepas - Gros Chêne', latitude: 48.1265620, longitude: -1.6642816 },
  { name: 'Maurepas - Allée Charline Baudry', latitude: 48.128167, longitude: -1.665542 },
  { name: 'Maurepas - Rue Fernand Robert', latitude: 48.125180, longitude: -1.667480 },
  { name: 'Maurepas', latitude: 48.126830, longitude: -1.668651 },
  { name: 'ZUP Sud - Square de Copenhague', latitude: 48.097028, longitude: -1.672090 },
  { name: 'ZUP Sud - 1 Place de Montréal', latitude: 48.097599, longitude: -1.674789 },
  { name: 'ZUP Sud - Station de métro Triangle', latitude: 48.097065, longitude: -1.676107 },
  { name: 'ZUP Sud - Station de métro Henri Fréville', latitude: 48.086202, longitude: -1.663223 },
  { name: 'ZUP Sud - La Poterie', latitude: 48.091019, longitude: -1.643879 },
  { name: 'Centre-ville - Rue Saint-Malo', latitude: 48.111780, longitude: -1.679854 },
  { name: 'Centre-ville - 9 Rue de Penhoët', latitude: 48.113514, longitude: -1.681315 },
  { name: 'Centre-ville - Place des Lices', latitude: 48.114951, longitude: -1.684158 },
  { name: 'Centre-ville - Saint-Anne', latitude: 48.112737, longitude: -1.679227 },
  { name: 'Centre-ville - Place du Colombier', latitude: 48.107057, longitude: -1.678862 },
  { name: 'Agence', Latitude : 48.13845, longitude: -1.68456 },
  { name: 'foot', Latitude : 48.1235798, longitude: -1.4539494 },
  { name: '8 rue Robert Doisneau, Acigné', latitude: 48.1408369, longitude: -1.5222797 } // Nouvelle adresse
];

// Fonction pour calculer la distance entre deux coordonnées
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

const App = () => {
  const [showContacts, setShowContacts] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Fonction pour afficher/masquer les contacts
  const toggleContacts = () => {
    setShowContacts(!showContacts);
  };

  // Fonction pour envoyer l'email d'urgence avec EmailJS
  const sendEmergencyEmail = (geoPosition) => {
    const templateParams = {
      to_email: 'aurelien.herbin@grdf.fr',
      gps_location: geoPosition,
    };

    emailjs.send('service_crrwqxu', 'template_jn0mlzk', templateParams, 'eVoNJE3VFO-dO61kL')
      .then(() => {
        alert("Email d'urgence envoyé avec succès !");
      }, (error) => {
        console.error("Échec de l'envoi de l'email :", error);
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
          sendEmergencyEmail(geoPosition); // Utiliser EmailJS pour envoyer l'email
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

  // Demander la permission des notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Vérifier la position actuelle et les quartiers sensibles
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

              // Envoyer une notification
              if (Notification.permission === "granted") {
                new Notification("Attention", {
                  body: `Vous êtes proche du quartier sensible : ${area.name}. Soyez vigilant !`,
                  icon: '/alert-icon.jpeg' // Icône personnalisée
                });
              }
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
    <div style={{ padding: '20px', fontFamily: 'Arial', position: 'relative', height: '100vh' }}>
      {/* Titre de l'application en haut */}
      <h1>Application d'alerte GRDF</h1>

      {/* Message d'alerte de quartier sensible */}
      {alertMessage && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'yellow', color: 'black' }}>
          {alertMessage}
        </div>
      )}

      {/* Texte indicatif */}
      <div id="animated-text" style={{ fontSize: '14px', lineHeight: '1.5', color: '#333', marginBottom: '20px', fontStyle: 'italic' }}>
        <p style={{ fontWeight: 'bold' }}>Ceci est une application d'essai créée par le GAP-AI35.</p>
        <p>Cliquez sur "secours" si vous êtes en situation d'urgence, un mail sera envoyé au BEX leur indiquant cela et leur demandant d'appeler les forces de l'ordre.</p>
      </div>

      {/* Bouton pour afficher les contacts */}
      <button 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: '#FFFFFF', 
          color: '#001f3f', 
          borderRadius: '8px', 
          border: '2px solid #001f3f', 
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
          cursor: 'pointer', 
          transition: 'background-color 0.3s ease' 
        }} 
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}
        onClick={toggleContacts}
      >
        Contacter ma hiérarchie
      </button>

      {/* Affichage conditionnel des contacts */}
      {showContacts && (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ marginBottom: '20px' }}>
      <a href="tel:+33624271929" style={{ 
        textDecoration: 'none', 
        padding: '10px 30px', 
        fontSize: '16px', 
        backgroundColor: '#FFFFFF', 
        color: '#001f3f', 
        borderRadius: '8px', 
        border: '2px solid #001f3f', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
        cursor: 'pointer', 
        marginBottom: '15px', 
        display: 'inline-block', 
        transition: 'background-color 0.3s ease' 
      }} 
      onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}>
        Oublier Christian (06 24 24 49 59)
      </a>
    </div>
    <div>
      <a href="tel:+33638992988" style={{ 
        textDecoration: 'none', 
        padding: '10px 30px', 
        fontSize: '16px', 
        backgroundColor: '#FFFFFF', 
        color: '#001f3f', 
        borderRadius: '8px', 
        border: '2px solid #001f3f', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
        cursor: 'pointer', 
        marginBottom: '15px', 
        display: 'inline-block', 
        transition: 'background-color 0.3s ease' 
      }} 
      onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}>
        Edouard Trebutien (06 38 21 22 23)
      </a>
      <a href="tel:+33669041510" style={{ 
        textDecoration: 'none', 
        padding: '10px 30px', 
        fontSize: '16px', 
        backgroundColor: '#FFFFFF', 
        color: '#001f3f', 
        borderRadius: '8px', 
        border: '2px solid #001f3f', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
        cursor: 'pointer', 
        marginBottom: '15px', 
        display: 'inline-block', 
        transition: 'background-color 0.3s ease' 
      }} 
      onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}>
        Anthony Dapolon (06 69 05 06 11)
      </a>
      <a href="tel:+33784100621" style={{ 
        textDecoration: 'none', 
        padding: '10px 30px', 
        fontSize: '16px', 
        backgroundColor: '#FFFFFF', 
        color: '#001f3f', 
        borderRadius: '8px', 
        border: '2px solid #001f3f', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
        cursor: 'pointer', 
        marginBottom: '15px', 
        display: 'inline-block', 
        transition: 'background-color 0.3s ease' 
      }} 
      onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#FFFFFF'}>
        Pierre Treff (07 84 12 11 13)
      </a>
    </div>
  </div>
)}


      {/* Bouton pour envoyer un email d'urgence */}
      <button 
        style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'red', color: 'white', borderRadius: '20px', border: 'none', cursor: 'pointer', marginTop: '20px' }} 
        onClick={getGeoLocation}>
        Secours
      </button>
    </div>
  );
};

export default App;
