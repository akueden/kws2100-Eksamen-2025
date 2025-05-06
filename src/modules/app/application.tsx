import React, { useEffect, useRef } from "react";
import { map } from "./map/initMap";
import { DrawPointButton } from "./components/drawPointButton";
import { DrawPolygonButton } from "./components/drawPolygonButton";
import { DrawCircleButton } from "./components/drawCircleButton";
import {
  drawingVectorLayer,
  drawingVectorSource,
} from "./components/drawingVectorLayer";
import { Feature } from "ol";

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    map.setTarget(mapRef.current!);

    map.on("click", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l === drawingVectorLayer,
      });
      for (const feature of features) {
        drawingVectorSource.removeFeature(feature as Feature);
      }
    });
  }, []);

  return (
    <>
      <DrawPointButton map={map} source={drawingVectorSource} />
      <DrawPolygonButton map={map} source={drawingVectorSource} />
      <DrawCircleButton map={map} source={drawingVectorSource} />
      <div ref={mapRef}></div>
    </>
  );
}
