// src/components/Map.js
import React, { useEffect, useRef } from "react";

const Map = ({ latitude, longitude }) => {
  const mapRef = useRef(null); // Reference for the map container

  useEffect(() => {
    if (window.google && latitude && longitude) {
      // Initialize the map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude }, // Center at the user's location
        zoom: 15, // Zoom level
      });

      // Add a marker at the user's location
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "User Location",
      });
    }
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px" }} // Adjust the size of the map
    ></div>
  );
};

export default Map;
