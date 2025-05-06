import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";

const schoolSource = new VectorSource({
  url: "/kws2100-Eksamen-2025/api/skoler",
  format: new GeoJSON(),
});

export const schoolLayer = new VectorLayer({
  source: schoolSource,
  zIndex: 5,
  style: (feature) => {
    const elevtall = feature.get("antallelever") as number;
    const radius = Math.max(4, Math.min(elevtall / 20, 30));
    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: "rgba(0,0,255,0.6)" }),
        stroke: new Stroke({ color: "white", width: 1 }),
      }),
    });
  },
});
