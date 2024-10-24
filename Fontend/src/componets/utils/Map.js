import React, { useEffect, useRef, useState } from 'react';

const Map = ({ latitude, longitude, employerLatitude, employerLongitude }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      // Mark the job location
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: "Vị trí công việc",
      });

      // Mark the employer's location
      new window.google.maps.Marker({
        position: { lat: employerLatitude, lng: employerLongitude },
        map,
        title: "Vị trí nhà tuyển dụng", // Title for employer's location
      });

      // Optional: Add logic for user's location if needed
    };

    // Load the Google Maps script and initialize the map
    if (window.google) {
      loadMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`; // Update with your actual API key
      script.onload = () => {
        loadMap();
      };
      script.onerror = () => {
        console.error("Failed to load the Google Maps script.");
      };
      document.body.appendChild(script);
    }
  }, [latitude, longitude, employerLatitude, employerLongitude]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};


export default Map;
