import React, { useEffect, useRef, useState } from 'react';

const Map = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      // Đánh dấu vị trí công việc
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: "Vị trí công việc",
      });

      // Đánh dấu vị trí hiện tại của người dùng nếu có
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map,
          title: "Vị trí của bạn",
        });

        // Vẽ đường từ vị trí của người dùng đến vị trí công việc
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        const request = {
          origin: userLocation,
          destination: { lat: latitude, lng: longitude },
          travelMode: window.google.maps.TravelMode.DRIVING, // Bạn có thể thay đổi mode nếu cần
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        });
      }
    };

    // Lấy vị trí hiện tại của người dùng
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            loadMap(); // Load map sau khi có vị trí
          },
          (error) => {
            console.error("Error getting location:", error);
            loadMap(); // Load map nếu không thể lấy vị trí
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        loadMap(); // Load map nếu không hỗ trợ Geolocation
      }
    };

    if (window.google) {
      getUserLocation();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAuAo7Y-aDuHJufQ5w538pdoY9cBA44Zzg&libraries=geometry`;
      script.onload = () => {
        getUserLocation();
      };
      document.body.appendChild(script);
    }
  }, [latitude, longitude, userLocation]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default Map;
