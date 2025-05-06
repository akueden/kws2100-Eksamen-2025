import { Hono } from "hono";
import { serve } from "@hono/node-server";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

const app = new Hono();

app.get("/api/test", (c) => {
  return c.text("Serveren kjører!");
});

app.get("/kws2100-Eksamen-2025/api/skoler", async (c) => {
  try {
    const result = await postgresql.query(`
      SELECT skolenavn, kommunenummer,
        ST_AsGeoJSON(ST_Transform(posisjon, 4326))::json AS geometry
      FROM grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole
      WHERE posisjon IS NOT NULL
    `);
    return c.json({
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: result.rows.map(({ geometry: { coordinates }, ...props }) => ({
        type: "Feature",
        properties: props,
        geometry: { type: "Point", coordinates },
      })),
    });
  } catch (err: any) {
    console.error("Feil i /skoler:", err);
    return c.text("Noe gikk galt på serveren");
  }
});

app.get("/kws2100-Eksamen-2025/api/fylker", async (c) => {
  try {
    const result = await postgresql.query(`
      SELECT n.navn, f.fylkesnummer,
        ST_AsGeoJSON(ST_Transform(f.omrade, 4326))::json AS geometry
      FROM fylker_f5ebc56204d5463496260e99cba427e8.fylke f
      JOIN fylker_f5ebc56204d5463496260e99cba427e8.administrativenhetnavn n
        ON f.lokalid = n.fylke_fk
    `);
    return c.json({
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: result.rows.map(({ geometry, ...props }) => ({
        type: "Feature",
        properties: props,
        geometry,
      })),
    });
  } catch (err: any) {
    console.error("Feil i /fylker:", err);
    return c.text("Noe gikk galt på serveren");
  }
});

app.get("/kws2100-Eksamen-2025/api/tilfluktsrom", async (c) => {
  try {
    const result = await postgresql.query(`
      SELECT
        objid,
        objtype, 
        plasser,
        adresse,
        (posisjon)::json AS geometry
      FROM tilfluktsromoffentlige_1ca0552f72b448c48751aac65d753676.tilfluktsrom
      WHERE posisjon IS NOT NULL
    `);

    const geojson = {
      type: "FeatureCollection" as const,
      crs: {
        type: "name" as const,
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: result.rows.map((row) => {
        const { geometry, ...props } = row;
        return {
          type: "Feature" as const,
          properties: props,
          geometry: geometry as {
            type: "Point";
            coordinates: [number, number];
          },
        };
      }),
    };
    return c.json(geojson);
  } catch (err: any) {
    console.error("Feil i /tilfluktsrom:");
    return c.text("Noe gikk galt på serveren");
  }
});

serve(app);
