import React from "react";
import { Draw } from "ol/interaction";
import { Map } from "ol";
import VectorSource from "ol/source/Vector";

export function DrawPolygonButton({
  map,
  source,
}: {
  map: Map;
  source: VectorSource;
}) {
  function handleClick() {
    const draw = new Draw({ type: "Polygon", source });
    map.addInteraction(draw);
    source.once("addfeature", () => map.removeInteraction(draw));
  }

  return <button onClick={handleClick}>Add polygon</button>;
}
