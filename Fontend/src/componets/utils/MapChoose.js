import React, { useEffect, useRef, useState } from 'react';

const MapChoose = ({ onPositionChange }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tạo map
  const createMap = (center) => {
    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
        mapTypeControl: true,
        fullscreenControl: true,
      });

      const newMarker = new window.google.maps.Marker({
        position: center,
        map: newMap,
        draggable: true,
        title: "Kéo để di chuyển",
      });

      setMap(newMap);
      setMarker(newMarker);

      // Thêm các event listeners
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        onPositionChange({
          lat: position.lat(),
          lng: position.lng()
        });
      });

      newMap.addListener('click', (event) => {
        newMarker.setPosition(event.latLng);
        onPositionChange({
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        });
      });

      // Gọi callback ban đầu
      onPositionChange(center);
      setIsLoading(false);
    } catch (err) {
      setError('Lỗi khi tạo bản đồ: ' + err.message);
      setIsLoading(false);
    }
  };

  // Hàm khởi tạo map
  const initMap = () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            createMap({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => {
            // Fallback to default location
            createMap({ lat: 10.762622, lng: 106.660172 });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        createMap({ lat: 10.762622, lng: 106.660172 });
      }
    } catch (err) {
      setError('Lỗi khi khởi tạo bản đồ: ' + err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }

      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          initMap();
        };

        script.onerror = () => {
          setError('Không thể tải Google Maps');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      }
    };

    // Đợi một chút để đảm bảo DOM đã được render
    setTimeout(loadGoogleMapsScript, 100);

    // Cleanup
    return () => {
      if (marker) {
        window.google?.maps?.event?.clearInstanceListeners(marker);
      }
      if (map) {
        window.google?.maps?.event?.clearInstanceListeners(map);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {isLoading && <div>Đang tải bản đồ...</div>}
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px',
          display: isLoading ? 'none' : 'block'
        }} 
      />
      {!isLoading && (
        <div style={{ 
          marginTop: '10px', 
          fontSize: '14px', 
          color: '#666',
          textAlign: 'center'
        }}>
          * Kéo marker hoặc click vào bản đồ để chọn vị trí
        </div>
      )}
    </div>
  );
};

export default MapChoose;