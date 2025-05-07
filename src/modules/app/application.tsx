import React, { useEffect, useRef, useState } from "react";
import { map } from "./map/initMap";
import { DrawPointButton } from "./components/drawPointButton";
import { DrawPolygonButton } from "./components/drawPolygonButton";
import { DrawCircleButton } from "./components/drawCircleButton";
import {
  drawingVectorLayer,
  drawingVectorSource,
} from "./components/drawingVectorLayer";
import { Feature } from "ol";
import LiveMapWithEnturOverlay from "./components/enturOverlay";
import "./application.css";
import { createSchoolPopup } from "./layers/schoolLayer";
import { createShelterPopup } from "./layers/shelterLayer";

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      setMapReady(true);
    }

    map.on("click", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l === drawingVectorLayer,
      });
      for (const feature of features) {
        drawingVectorSource.removeFeature(feature as Feature);
      }
    });
  }, []);

  useEffect(() => {
    if (mapReady) {
      createSchoolPopup(map);
      createShelterPopup(map);
    }
  }, [mapReady]);

  return (
    <div className={"app"}>
      <nav className={"menu"}>
        <DrawPointButton map={map} source={drawingVectorSource} />
        <DrawPolygonButton map={map} source={drawingVectorSource} />
        <DrawCircleButton map={map} source={drawingVectorSource} />
      </nav>

      <main className={"map-wrapper"}>
        <div ref={mapRef} className={"map"} />
        {mapReady && <LiveMapWithEnturOverlay map={map} />}
      </main>
    </div>
  );
}
