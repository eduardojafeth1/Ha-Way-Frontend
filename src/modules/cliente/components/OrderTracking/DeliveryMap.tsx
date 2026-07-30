import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  getRoute,
  type Coordinates,
} from "../../../../services/routeService";

interface DeliveryMapProps {

  customerLocation: Coordinates;

  providerLocation: Coordinates;

}

const customerIcon = new L.Icon({

  iconUrl: "/icons/customer-marker.png",

  iconSize: [38, 38],

  iconAnchor: [19, 38],

});

const providerIcon = new L.Icon({

  iconUrl: "/icons/truck-marker.png",

  iconSize: [42, 42],

  iconAnchor: [21, 42],

});

function FitBounds({

  customerLocation,

  providerLocation,

}: DeliveryMapProps) {

  const map = useMap();

  useEffect(() => {

    map.fitBounds(

      [

        [customerLocation.lat, customerLocation.lng],

        [providerLocation.lat, providerLocation.lng],

      ],

      {

        padding: [50, 50],

      }

    );

  }, [

    map,

    customerLocation,

    providerLocation,

  ]);

  return null;

}

export default function DeliveryMap({

  customerLocation,

  providerLocation,

}: DeliveryMapProps) {

  const [route, setRoute] = useState<Coordinates[]>([]);

  /*
  ===========================================================
  BACKEND

  Cuando el conductor vaya avanzando,
  providerLocation se actualizará mediante WebSockets.

  socket.on("provider-location",(location)=>{

      setProviderLocation(location);

  });

  El useEffect volverá a ejecutarse y solicitará
  automáticamente una nueva ruta a OSRM.

  ===========================================================
  */

  useEffect(() => {

    async function loadRoute() {

      try {

        const routeData = await getRoute(

          providerLocation,

          customerLocation

        );

        setRoute(routeData.coordinates);

      } catch (error) {

        console.error(error);

      }

    }

    loadRoute();

  }, [

    providerLocation,

    customerLocation,

  ]);

  return (

    <div
      className="
        rounded-3xl
        overflow-hidden
        shadow-md
      "
    >

      <MapContainer
        zoom={15}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "320px",
        }}
      >

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds

          customerLocation={customerLocation}

          providerLocation={providerLocation}

        />

        <Marker

          position={[

            customerLocation.lat,

            customerLocation.lng,

          ]}

          icon={customerIcon}

        />

        <Marker

          position={[

            providerLocation.lat,

            providerLocation.lng,

          ]}

          icon={providerIcon}

        />

        {route.length > 0 && (

          <Polyline

            positions={

              route.map((point) => [

                point.lat,

                point.lng,

              ])

            }

            pathOptions={{

              color: "#0260eb",

              weight: 6,

            }}

          />

        )}

      </MapContainer>

    </div>

  );

}