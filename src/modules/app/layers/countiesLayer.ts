import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Stroke, Fill } from "ol/style";

const countiesSource = new VectorSource({
  url: "/kws2100-Eksamen-2025/api/fylker",
  format: new GeoJSON(),
});

export const countiesLayer = new VectorLayer({
  source: countiesSource,
  style: new Style({
    stroke: new Stroke({ color: "#228B22", width: 2 }),
    fill: new Fill({ color: "rgba(0,0,0,0)" }),
  }),
});
