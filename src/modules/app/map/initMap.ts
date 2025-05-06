import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { drawingVectorLayer } from "../components/drawingVectorLayer";

useGeographic();

export const map = new Map({
  view: new View({ center: [10.76, 59.92], zoom: 12 }),
  layers: [new TileLayer({ source: new OSM() }), drawingVectorLayer],
});
