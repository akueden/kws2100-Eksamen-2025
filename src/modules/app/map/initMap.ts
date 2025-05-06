import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { drawingVectorLayer } from "../components/drawingVectorLayer";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const countiesLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-Eksamen-2025/geojson/fylker.geojson",
    format: new GeoJSON(),
  }),
});

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-Eksamen-2025/api/skoler.geojson",
    format: new GeoJSON(),
  }),
});

export const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 8 }),
  layers: [osmLayer, countiesLayer, schoolLayer, drawingVectorLayer],
});
