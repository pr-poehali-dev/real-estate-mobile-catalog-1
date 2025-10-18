import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  rooms: number;
  lat: number;
  lng: number;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: hsl(199, 89%, 48%);
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapBounds({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map(p => [p.lat, p.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);

  return null;
}

export default function PropertyMap({ properties, onPropertyClick }: PropertyMapProps) {
  const center: [number, number] = [40.1776, 44.5126];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ֏';
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '600px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds properties={properties} />
      {properties.map((property) => {
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background: hsl(199, 89%, 48%);
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${property.rooms}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        return (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onPropertyClick(property)
            }}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{property.title}</h3>
                <p className="text-xs text-muted-foreground">{property.address}</p>
                <p className="text-sm font-bold text-primary">{formatPrice(property.price)}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
