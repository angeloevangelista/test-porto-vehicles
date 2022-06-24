import { AiOutlineCar } from "react-icons/ai";
import React, { useMemo } from "react";

import vehiclesJson from "../../assets/data/zero-km-vehicles.json";

interface Vehicle {
  codigoTipoTabela: number;
  codigoVeiculoTabela: number;
  digitoVeiculoTabela: number;
  placa: string;
  anoModelo: number;
  flagZeroKm: string;
  anoFabricacao: number;
  chassi: string;
  nomeVersao: string;
  modelo: string;
}

const NewVehicles: React.FC = () => {
  const vehicles = useMemo<Vehicle[]>(() => vehiclesJson, []);

  return (
    <>
      <header className="page-header">
        <AiOutlineCar size={24} color="#7e7e7e" />

        <strong>Veículos Novos</strong>
      </header>

      <div className="vehicle-board">
        {vehicles.map((vehicle) => (
          <div key={vehicle.chassi} className="vehicle-board-item">
            <div>
              <strong>Placa: </strong>
              <span>{vehicle.placa}</span>
            </div>
            <div>
              <strong>Modelo: </strong>
              <span>{vehicle.modelo}</span>
            </div>
            <div>
              <strong>Cód. tipo tabela: </strong>
              <span>{vehicle.codigoTipoTabela}</span>
            </div>
            <div>
              <strong>Cód. veículo tabela: </strong>
              <span>{vehicle.codigoVeiculoTabela}</span>
            </div>
            <div>
              <strong>Dígito veículo tabela: </strong>
              <span>{vehicle.digitoVeiculoTabela}</span>
            </div>
            <div>
              <strong>Ano modelo: </strong>
              <span>{vehicle.anoModelo}</span>
            </div>
            <div>
              <strong>Ano fabricacao: </strong>
              <span>{vehicle.anoFabricacao}</span>
            </div>
            <div>
              <strong>Chassi: </strong>
              <span>{vehicle.chassi}</span>
            </div>
            <div>
              <strong>Nome versão: </strong>
              <span>{vehicle.nomeVersao}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewVehicles;
