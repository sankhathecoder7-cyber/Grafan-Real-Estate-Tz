import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

function MapPage() {
  return (
    <div className="h-screen w-full">

      <MapContainer
        center={[-6.7924, 39.2083]}
        zoom={12}
        className="h-full w-full"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[-6.7924, 39.2083]}>
          <Popup>
            2 Bedroom Apartment - Mikocheni
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  )
}

export default MapPage