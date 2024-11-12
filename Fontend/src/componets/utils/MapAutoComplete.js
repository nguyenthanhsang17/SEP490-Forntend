import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import L from "leaflet";

// Utility function to remove administrative terms
const removeAdministrativeTerms = (input) => {
  if (!input) return null;
  return input
    .replace(/(?:quận|huyện|xã|tỉnh|phường|thị trấn|thành phố)\s*/gi, "")
    .trim();
};

// Normalize address function
const normalizeAddress = (addressData) => {
  const addressKeys = {
    commune: ['village', 'residential', 'quarter', 'neighbourhood'],
    district: ['county', 'city_district', 'suburb'],
    province: ['state', 'city']
  };

  const findAddressPart = (keys) => {
    for (const key of keys) {
      if (addressData[key]) {
        return removeAdministrativeTerms(addressData[key]) || null;
      }
    }
    return null;
  };

  return {
    commune: findAddressPart(addressKeys.commune) || "Xã",
    district: findAddressPart(addressKeys.district) || "Huyện",
    province: findAddressPart(addressKeys.province) || "Tỉnh"
  };
};

// Search Control Component
const SearchControl = ({ onResultSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'vi',
        limit: 5
      }
    });

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      retainZoomLevel: false,
      autoClose: true,
      keepResult: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      onResultSelect(result.location);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onResultSelect]);

  return null;
};

// Custom Marker Icon
const customMarkerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Main Map Component
const MapAutoComplete = ({ 
  onSubmit, 
  onPositionChange, 
  initialPosition 
}) => {
  const defaultPosition = [21.01355745, 105.5252751342127];
  
  // Use ref to track the last submitted position
  const lastSubmittedPositionRef = useRef(null);
  
  // Provider ref to avoid recreating on each render
  const providerRef = useRef(new OpenStreetMapProvider({
    params: {
      "accept-language": "vi",
    },
  }));

  const [position, setPosition] = useState(
    Array.isArray(initialPosition) && initialPosition.length === 2
      ? initialPosition
      : defaultPosition
  );
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState({});
  const initialPositionUpdatedRef = useRef(false);

  // Memoized update position function with position comparison
  const updatePosition = useCallback(async (newPosition) => {
    // Check if the new position is the same as the last submitted
    const isSamePosition = 
      lastSubmittedPositionRef.current && 
      lastSubmittedPositionRef.current[0] === newPosition[0] && 
      lastSubmittedPositionRef.current[1] === newPosition[1];

    if (isSamePosition) {
      console.log("Skipping duplicate position update");
      return;
    }

    // Update the position state
    setPosition(newPosition);

    try {
      const results = await providerRef.current.search({ 
        query: `${newPosition[0]}, ${newPosition[1]}` 
      });

      if (results && results.length > 0) {
        setAddress(results[0].label);
      }

      // Only call reverse geocoding if the address is different
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPosition[0]}&lon=${newPosition[1]}&addressdetails=1&accept-language=vi`
      );

      if (response.data && response.data.address) {
        const normalized = normalizeAddress(response.data.address);

        // Update details
        setDetails({
          address: response.data.address,
          latitude: newPosition[0],
          longitude: newPosition[1],
        });

        // Submit only if it's a new position
        const locationData = {
          addressDetail: results[0]?.label || "",
          address: normalized,
          latitude: newPosition[0],
          longitude: newPosition[1],
        };

        // Update the ref with the current position
        lastSubmittedPositionRef.current = newPosition;

        // Call onSubmit
        onSubmit(locationData);
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  }, [onSubmit]);

  // Initial position effect with dependency array
  useEffect(() => {
    // Chỉ update khi chưa từng update và có initial position
    if (initialPosition && !initialPositionUpdatedRef.current) {
      updatePosition(initialPosition);
      initialPositionUpdatedRef.current = true;
    }
  }, [initialPosition, updatePosition]);

  // Handle Marker Drag
  const handleMarkerDragEnd = useCallback((e) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    
    // Chỉ update khi vị trí thực sự thay đổi
    if (
      newPosition.lat !== position[0] || 
      newPosition.lng !== position[1]
    ) {
      updatePosition([newPosition.lat, newPosition.lng]);
      
      onPositionChange({
        lat: newPosition.lat,
        lng: newPosition.lng
      }, address);
    }
  }, [updatePosition, onPositionChange, address, position]);


  const handleResultSelect = useCallback((location) => {
    const uniqueKey = `${location.y}-${location.x}`;
    console.log(location);
    if (location?.x && location?.y) {
      // Sử dụng ref để lưu lại lần gọi cuối
      if (handleResultSelect.lastKey !== uniqueKey) {
        updatePosition([location.y, location.x]);
        handleResultSelect.lastKey = uniqueKey;
      }
    }
  }, [updatePosition]);
  
  // Khởi tạo lastKey
  handleResultSelect.lastKey = null;

  return (
    <Box style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
      <p>{address}</p>
      <MapContainer
        center={position}
        zoom={20}
        style={{ height: "55vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchControl
          onResultSelect={(location) => {
            handleResultSelect(location);
            console.log("chayj 1 lan");
          }}
        />
        {position && (
          <Marker
            position={position}
            icon={customMarkerIcon}
            draggable={true}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          >
            <Popup>
              <a
                href={`https://www.google.com/maps?q=${position[0]},${position[1]}&ll=${position[0]},${position[1]}&z=17`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {details.address
                  ? `${details.address.road}, ${details.address.city}`
                  : "No details"}
              </a>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
   );
};

export default MapAutoComplete;