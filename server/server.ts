import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new pg.Pool({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      port: 5432,
      database: "postgres",
    });

const app = new Hono();
const CRS = {
  type: "name",
  properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
};

function toFeatureCollection<T extends Record<string, any>>(
  rows: (T & { geometry: any })[],
  geomType: string,
) {
  return {
    type: "FeatureCollection" as const,
    crs: CRS,
    features: rows.map(({ geometry, ...props }) => ({
      type: "Feature" as const,
      properties: props,
      geometry: { ...geometry, type: geomType },
    })),
  };
}

app.get("/api/skoler", async (c) => {
  const sql = `
    SELECT skolenavn,
           antallelever,
           kommunenummer,
           ST_AsGeoJSON(ST_Transform(posisjon, 4326))::json AS geometry
    FROM grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole
    WHERE posisjon IS NOT NULL;
  `;
  try {
    const { rows } = await pool.query(sql);
    return c.json(toFeatureCollection(rows, "Point"));
  } catch (err) {
    console.error("Feil i /api/skoler:", err);
    return c.text("Noe gikk galt på serveren");
  }
});

app.get("/api/fylker", async (c) => {
  const sql = `
    SELECT n.navn,
           f.fylkesnummer,
           ST_AsGeoJSON(ST_Transform(f.omrade, 4326))::json AS geometry
    FROM fylker_f5ebc56204d5463496260e99cba427e8.fylke f
    JOIN fylker_f5ebc56204d5463496260e99cba427e8.administrativenhetnavn n
      ON f.lokalid = n.fylke_fk;
  `;
  try {
    const { rows } = await pool.query(sql);
    return c.json(toFeatureCollection(rows, "MultiPolygon"));
  } catch (err) {
    console.error("Feil i /api/fylker:", err);
    return c.text("Noe gikk galt på serveren");
  }
});

app.get("/api/tilfluktsrom", async (c) => {
  const sql = `
    SELECT objid,
           objtype,
           plasser,
           adresse,
           ST_AsGeoJSON(ST_Transform(posisjon, 4326))::json AS geometry
    FROM tilfluktsromoffentlige_1ca0552f72b448c48751aac65d753676.tilfluktsrom
    WHERE posisjon IS NOT NULL;
  `;
  try {
    const { rows } = await pool.query(sql);
    return c.json(toFeatureCollection(rows, "Point"));
  } catch (err) {
    console.error("Feil i /api/tilfluktsrom:", err);
    return c.text("Noe gikk galt på serveren");
  }
});

app.use("*", serveStatic({ root: "../dist" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`Server lytter på http://localhost:${port}`);
