'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Marker = { id: number; lat: number; lng: number; name?: string };

export default function Map({
                                markers = [],
                                dark = false,
                                className = '',
                                onMarkerSelect,
                            }: {
    markers?: Marker[];
    dark?: boolean;
    className?: string;
    onMarkerSelect?: (id: number) => void;
}) {
    const center: [number, number] =
        markers[0] ? [markers[0].lat, markers[0].lng] : [40.4168, -3.7038]; // Madrid

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={13}
                className="w-full h-full"
                scrollWheelZoom
            >
                <TileLayer
                    url={
                        dark
                            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                />

                {markers.map((m) => (
                    <CircleMarker
                        key={m.id}
                        center={[m.lat, m.lng]}
                        radius={8}
                        pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.9 }}
                        eventHandlers={{ click: () => onMarkerSelect?.(m.id) }}
                    >
                        {m.name && <Popup><b>{m.name}</b></Popup>}
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}