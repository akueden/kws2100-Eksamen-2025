import React, { useEffect, useRef } from "react";
import { Map, Overlay, Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeedMessage } from "../../../../generated/gtfs-realtime";
import "ol/ol.css";

interface Props {
  map: Map;
}

const vehicleLayer = new VectorLayer({
  style: (feature) =>
    new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "rgba(50, 53, 82, 0.8)" }),
        stroke: new Stroke({ color: "white", width: 1 }),
      }),
      text: new Text({
        text: feature.get("routeId"),
        font: "bold 10px sans-serif",
        fill: new Fill({ color: "white" }),
        stroke: new Stroke({ color: "black", width: 3 }),
        offsetY: -15,
      }),
    }),
});

async function updateVehicleLayer() {
  try {
    const res = await fetch(
      "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions",
    );
    const buffer = await res.arrayBuffer();
    const messages = FeedMessage.decode(new Uint8Array(buffer));
    const features = messages.entity.map((entity) => {
      const pos = entity.vehicle?.position!;
      return new Feature({
        geometry: new Point([pos.longitude, pos.latitude]),
        routeId: entity.vehicle?.trip?.routeId,
        properties: entity.vehicle,
      });
    });
    vehicleLayer.setSource(new VectorSource({ features }));
  } catch (err) {
    console.error("Feil ved henting av data");
  }
}

export default function LiveMapWithEnturOverlay({ map }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!overlayRef.current || !map) return;

    map.addLayer(vehicleLayer);

    const overlay = new Overlay({
      element: overlayRef.current!,
      positioning: "top-center",
    });
    map.addOverlay(overlay);

    map.on("click", (e) => {
      const selected = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l === vehicleLayer,
      }) as Feature[];

      if (selected.length === 0) {
        overlay.setPosition(undefined);
        overlayRef.current!.innerHTML = "";
      } else {
        const props = selected[0].getProperties();
        overlay.setPosition(e.coordinate);
        overlayRef.current!.innerHTML = `
          <div style="background:white;padding:6px;border-radius:4px;">
            <strong>Rute:</strong> ${props.routeId || "?"}<br/>
            <strong>Trip ID:</strong> ${props.properties?.trip?.tripId || "?"}
          </div>
        `;
      }
    });

    void updateVehicleLayer();
    const interval = setInterval(() => void updateVehicleLayer(), 15000);

    return () => {
      clearInterval(interval);
      map.removeLayer(vehicleLayer);
      map.removeOverlay(overlay);
    };
  }, [map]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}
