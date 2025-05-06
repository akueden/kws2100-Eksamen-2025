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
  zIndex: 10,
  style: (feature) => {
    const plasser = (feature.get("plasser") as number) || 0;
    const radius = Math.max(4, Math.min(plasser / 20, 30));
    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: "rgba(255,0,0,0.6)" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    });
  },
});
