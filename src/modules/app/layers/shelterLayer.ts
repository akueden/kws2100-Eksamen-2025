import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

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
        fill: new Fill({ color: "rgba(72, 113, 142, 0.8)" }),
        stroke: new Stroke({ color: "white", width: 1 }),
      }),
    });
  },
});

interface ShelterProperties {
  adresse: string;
  plasser: number;
}

export const createShelterPopup = (map: any) => {
  const popup = new Overlay({
    element: document.createElement("div"),
    positioning: "bottom-center",
    stopEvent: false,
  });

  map.addOverlay(popup);

  map.on("click", (event: any) => {
    const feature = map.forEachFeatureAtPixel(
      event.pixel,
      (feat: any) => feat,
      {
        layerFilter: (
          layer: VectorLayer<
            VectorSource<Feature<Geometry>>,
            Feature<Geometry>
          >,
        ) => layer === shelterLayer,
      },
    );

    if (feature) {
      const properties = feature.getProperties() as ShelterProperties;
      const name = properties.adresse;
      const plasser = properties.plasser;

      const content = `
        <div style="padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px;">
          <h3>${name}</h3>
          <p>Antall plasser: ${plasser}</p>
        </div>
      `;
      const popupElement = popup.getElement() as HTMLElement;
      popupElement.innerHTML = content;
      popup.setPosition(event.coordinate);
    } else {
      popup.setPosition(undefined);
    }
  });
};
