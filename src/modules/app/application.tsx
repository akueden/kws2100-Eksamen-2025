import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";

useGeographic();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current!,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [10.8, 59.9],
        zoom: 13,
      }),
    });

    return () => map.setTarget(undefined); // Rydd opp når komponent demonteres
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>;
}
