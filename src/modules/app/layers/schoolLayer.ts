import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import { Feature, Overlay } from "ol";
import { Geometry } from "ol/geom";

const schoolSource = new VectorSource({
  url: "/api/skoler",
  format: new GeoJSON(),
});

export const schoolLayer = new VectorLayer({
  source: schoolSource,
  zIndex: 8,
  style: (feature) => {
    const elevtall = feature.get("antallelever") as number;
    const radius = Math.max(5, Math.min(elevtall / 20, 30));
    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: "rgba(225, 141, 161, 0.6)" }),
        stroke: new Stroke({ color: "white", width: 1 }),
      }),
    });
  },
});

interface SchoolProperties {
  skolenavn: string;
  antallelever: number;
}

export const createSchoolPopup = (map: any) => {
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
        ) => layer === schoolLayer,
      },
    );

    if (feature) {
      const properties = feature.getProperties() as SchoolProperties;

      const name = properties.skolenavn;
      const elevtall = properties.antallelever;

      const content = `
        <div class="schoolpopup">
          <h3>${name}</h3>
          <p>Antall elever: ${elevtall}</p>
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
