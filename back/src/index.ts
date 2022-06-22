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
  const pool = new Pool(poolConfig);
  const poolClient = await pool.connect();

  const results = await poolClient.query<Vehicle>("SELECT * FROM vehicles");

  poolClient.release();
  await pool.end();

  return response.json(results.rows);
});

app.delete("/api/vehicles/:placa", async (request, response) => {
  const placa = request.params.placa.toUpperCase();

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
