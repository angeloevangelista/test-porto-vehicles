import axios from "axios";
import { AiOutlineCar } from "react-icons/ai";
import { BiSelectMultiple } from "react-icons/bi";
import React, { useCallback, useEffect, useRef } from "react";

import loaderSvg from "../../assets/svg/loader.svg";
import { toast } from "react-toastify";

interface Vehicle {
  placa: string;
  modelo: string;
  usado: boolean;
}

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const UsedVehicles: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const secretHiddenInputRef = useRef<HTMLInputElement | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);

    try {
      const vehiclesResponse = await axios.get<Vehicle[]>(
        `${apiBaseUrl}/vehicles`
      );

      setVehicles(vehiclesResponse.data.sort((a) => (a.usado ? 1 : -1)));
    } catch (error) {
      console.error(error);

      toast.error("Deu ruim rapaz!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const markVehicleAsUsed = useCallback(
    async (placa: string) => {
      navigator.clipboard.writeText(placa);

      toast.success("Copiado!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

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
    <>
      <header className="page-header">
        <AiOutlineCar size={24} color="#7e7e7e" />

        <strong>Placas ve??culos usados</strong>
      </header>

      <input type="hidden" ref={secretHiddenInputRef} />

      {loading && (
        <div className="loader-container">
          <img
            src={loaderSvg}
            alt="Loader bonit??o que o Angelo teve que copiar inteiro pro c??digo porque ?? um SVG bolad??o"
          />
        </div>
      )}

      {!!vehicles.length && (
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
      )}
    </>
  );
};

export default UsedVehicles;

