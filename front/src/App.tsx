import axios from "axios";
import { BiSelectMultiple } from "react-icons/bi";
import React, { useCallback, useEffect, useRef } from "react";

import "./App.css";

interface Vehicle {
  placa: string;
  modelo: string;
  usado: boolean;
}

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const App: React.FC = () => {
  const secretHiddenInputRef = useRef<HTMLInputElement | null>(null);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

  const loadVehicles = useCallback(async () => {
    const vehiclesResponse = await axios.get<Vehicle[]>(
      `${apiBaseUrl}/vehicles`
    );

    setVehicles(vehiclesResponse.data.sort((a) => (a.usado ? 1 : -1)));
  }, []);

  const markVehicleAsUsed = useCallback(
    async (placa: string) => {
      navigator.clipboard.writeText(placa);

      const foundVehicle = vehicles.find((v) => v.placa === placa);

      foundVehicle!.usado = true;

      const filteredVehicles = vehicles
        .map((p) => (p.placa === foundVehicle?.placa ? foundVehicle : p))
        .sort((a) => (a.usado ? 1 : -1));

      setVehicles(filteredVehicles);

      await axios.delete<Vehicle[]>(`${apiBaseUrl}/vehicles/${placa}`);

      loadVehicles();
    },
    [loadVehicles, vehicles]
  );

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return (
    <div className="App">
      <div className="title-container">
        <strong>Placas da felicidade</strong>
        <small>Algum cabeção apagou o do dontpad 😀</small>
      </div>

      <input type="hidden" ref={secretHiddenInputRef} />

      <ul className="vehicle-list">
        {vehicles.map((vehicle) => (
          <li
            data-used={vehicle.usado}
            key={vehicle.placa}
            className={`vehicle-item ${vehicle.usado ? "used" : ""}`}
          >
            <div>
              <strong>{vehicle.placa}</strong>

              <span>-</span>

              <span>{vehicle.modelo}</span>
            </div>

            <button
              disabled={vehicle.usado}
              onClick={() => markVehicleAsUsed(vehicle.placa)}
            >
              <BiSelectMultiple size={24} color="#7e7e7e" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
