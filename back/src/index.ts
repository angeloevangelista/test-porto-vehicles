import "dotenv/config";

import { Pool } from "pg";

import express from "express";
import cors from "cors";

const port = process.env.PORT || 3333;
const app = express();

interface Vehicle {
  placa: string;
  modelo: string;
  usado: boolean;
  zero_km: boolean;
}

app.use(cors());
app.use(express.json());

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

app.get("/api/vehicles", async (request, response) => {
  const zeroKm = request.query.zero_km == "true";

  const pool = new Pool(poolConfig);
  const poolClient = await pool.connect();

  const results = await poolClient.query<Vehicle>(
    "SELECT * FROM vehicles where zero_km = $1",
    [zeroKm]
  );

  poolClient.release();
  await pool.end();

  return response.json(results.rows);
});

app.delete("/api/vehicles/:placa", async (request, response) => {
  const placa = request.params.placa.toUpperCase() as string;

  const pool = new Pool(poolConfig);
  const poolClient = await pool.connect();

  const foundVehicles = await poolClient.query<Vehicle>(
    "SELECT * FROM vehicles where placa = $1",
    [placa]
  );

  if (foundVehicles.rows.length === 0)
    return response.status(404).json({
      error: "Tem esse carro aqui não, bro",
    });

  const { rowCount } = await pool.query(
    "UPDATE vehicles SET usado = true WHERE placa = $1",
    [placa]
  );

  poolClient.release();
  await pool.end();

  return response.status(rowCount === 0 ? 400 : 204).send();
});

app.get("/api/models", async (request, response) => {
  const pool = new Pool(poolConfig);
  const poolClient = await pool.connect();

  const results = await poolClient.query<Vehicle>(
    "SELECT * FROM vehicle_models"
  );

  poolClient.release();
  await pool.end();

  return response.json(results.rows);
});

app.delete("/api/models/:id", async (request, response) => {
  const modelId = request.params.id;

  const pool = new Pool(poolConfig);
  const poolClient = await pool.connect();

  const foundModels = await poolClient.query<Vehicle>(
    "SELECT * FROM vehicle_models where id = $1",
    [modelId]
  );

  if (foundModels.rows.length === 0)
    return response.status(404).json({
      error: "Tem esse modelo aqui não, bro",
    });

  const { rowCount } = await pool.query(
    "UPDATE vehicle_models SET usado = true where id = $1",
    [modelId]
  );

  poolClient.release();
  await pool.end();

  return response.status(rowCount === 0 ? 400 : 204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
