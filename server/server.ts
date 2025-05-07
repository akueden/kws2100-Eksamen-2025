import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const postgresql = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({ user: "postgres", password: "postgres" });

const app = new Hono();

const CRS = {
  type: "name",
  properties: { name: "ESPG:4326" },
};

app.get("/api/skoler", async (c) => {
  const sql = `
    SELECT skolenavn, antallelever, kommunenummer,
           ST_AsGeoJSON(ST_Transform(posisjon, 4326))::json AS geometry
      FROM grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole
     WHERE posisjon IS NOT NULL;
  `;
  const { rows } = await postgresql.query(sql);
  return c.json({
    type: "FeatureCollection",
    crs: CRS,
    features: rows.map(({ geometry, ...props }) => ({
      type: "Feature",
      properties: props,
      geometry: { type: "Point", coordinates: geometry.coordinates },
    })),
  });
});

app.get("/api/fylker", async (c) => {
  const sql = `
    SELECT n.navn, f.fylkesnummer,
           ST_AsGeoJSON(ST_Transform(f.omrade, 4326))::json AS geometry
      FROM fylker_f5ebc56204d5463496260e99cba427e8.fylke f
      JOIN fylker_f5ebc56204d5463496260e99cba427e8.administrativenhetnavn n
        ON f.lokalid = n.fylke_fk;
  `;
  const { rows } = await postgresql.query(sql);
  return c.json({
    type: "FeatureCollection",
    crs: CRS,
    features: rows.map(({ geometry, ...props }) => ({
      type: "Feature",
      properties: props,
      geometry,
    })),
  });
});

app.get("/api/tilfluktsrom", async (c) => {
  const sql = `
    SELECT objid, objtype, plasser, adresse,
           ST_AsGeoJSON(ST_Transform(posisjon, 4326))::json AS geometry
      FROM tilfluktsromoffentlige_1ca0552f72b448c48751aac65d753676.tilfluktsrom
     WHERE posisjon IS NOT NULL;
  `;
  const { rows } = await postgresql.query(sql);
  return c.json({
    type: "FeatureCollection",
    crs: CRS,
    features: rows.map(({ geometry, ...props }) => ({
      type: "Feature",
      properties: props,
      geometry,
    })),
  });
});

app.use("*", serveStatic({ root: "../dist" }));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
serve({ fetch: app.fetch, port });
