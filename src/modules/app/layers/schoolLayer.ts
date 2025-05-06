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
  style: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: "rgba(0,0,255,0.4)" }), // semitransparent blå
      stroke: new Stroke({ color: "white", width: 1 }),
    }),
  }),
  zIndex: 5,
});
