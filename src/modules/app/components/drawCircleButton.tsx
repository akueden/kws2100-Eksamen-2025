import React from "react";
import { Draw } from "ol/interaction";
import { Map } from "ol";
import VectorSource from "ol/source/Vector";

export function DrawCircleButton({
  map,
  source,
}: {
  map: Map;
  source: VectorSource;
}) {
  function handleClick() {
    const draw = new Draw({ type: "Circle", source });
    map.addInteraction(draw);
    source.once("addfeature", () => map.removeInteraction(draw));
  }

  return <button onClick={handleClick}>Add circle</button>;
}
