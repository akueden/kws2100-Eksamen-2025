import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";

const shelterSource = new VectorSource({
  url: "/kws2100-Eksamen-2025/api/tilfluktsrom",
  format: new GeoJSON(),
});

export const shelterLayer = new VectorLayer({
  source: shelterSource,
  style: new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  }),
});
