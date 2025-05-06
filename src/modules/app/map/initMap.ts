import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { drawingVectorLayer } from "../components/drawingVectorLayer";

import { countiesLayer } from "./layers/countiesLayer";
import { schoolLayer } from "./layers/schoolLayer";
import { shelterLayer } from "./layers/shelterLayer";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

export const map = new Map({
  view: new View({ center: [10.7, 59.9], zoom: 10 }),
  layers: [
    osmLayer,
    countiesLayer,
    shelterLayer,
    schoolLayer,
    drawingVectorLayer,
  ],
});
