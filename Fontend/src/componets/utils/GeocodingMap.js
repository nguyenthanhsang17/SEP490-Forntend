import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component để điều khiển việc di chuyển map
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, {
        duration: 1.5,
      });
    }
  }, [center, map]);
  
  return null;
}

function removeVietnamFromAddress(address) {
  const target = ", Việt Nam";

  // Kiểm tra nếu chuỗi kết thúc bằng "Việt Nam"
  if (address.endsWith(target)) {
    // Cắt "Việt Nam" khỏi chuỗi
    return address.slice(0, -target.length).trim(); // Dùng trim để loại bỏ khoảng trắng thừa
  }

  return address; // Nếu không có "Việt Nam", trả về chuỗi gốc
}

const GeocodingMap = ({handlePositionChange, handlePositionChangeToado}) => {
  const [position, setPosition] = useState([21.0285, 105.8542]); // Default: Hà Nội
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // Cập nhật vị trí marker
        setPosition([latitude, longitude]);

        // Log tọa độ vào console
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        console.log(data);
        const lc = removeVietnamFromAddress(data[0].display_name);
        console.log(lc);
        setLocation(lc);
        handlePositionChange(data);
      } else {
        alert('Không tìm thấy vị trí!');
      }
    } catch (error) {
      console.error('Lỗi khi tìm vị trí:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setPosition([position.lat, position.lng]);
    handlePositionChangeToado(position.lat, position.lng);
    console.log(`Marker dragged to: Latitude: ${position.lat}, Longitude: ${position.lng}`);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nhập địa chỉ công việc của bạn"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginRight: '10px',
            width: '600px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={position} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker 
            position={position} 
            draggable={true} 
            eventHandlers={{ 
              dragend: handleMarkerDragEnd 
            }}
          >
            <Popup>
              Vị trí bạn tìm thấy: <br />
              Latitude: {position[0]}, Longitude: {position[1]}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default GeocodingMap;