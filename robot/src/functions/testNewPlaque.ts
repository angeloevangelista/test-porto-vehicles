import { geradorPlacaVeiculo } from "gerador-placa-veiculo";

import { log } from "../util/log";
import { MarcaVeiculoEnum, ValidVehicle, ValoresMercado } from "../types";
import { PortoApiService } from "../services/portoApiService";
import { GlobalVariablesService } from "../services/globalVariablesService";

async function testNewPlaque<T>(
  vehicleCollection: T[],
  flagZeroKm: "S" | "N",
  convertToSaveFormat: (vehicle: ValoresMercado, plaque: string) => T
) {
  const portoApiService = PortoApiService.getInstance();

  let plaque: string;

  let molicarLength = 0;

  switch (GlobalVariablesService.marcaVeiculo) {
    case MarcaVeiculoEnum.Audi:
      molicarLength = 6;
      break;

    case MarcaVeiculoEnum.Volkswagen:
      molicarLength = 7;
      break;
  }

  do {
    plaque = geradorPlacaVeiculo();
  } while (GlobalVariablesService.testedPlaques.includes(plaque));

  const vehicle = await portoApiService.getVehicle(plaque, flagZeroKm);

  GlobalVariablesService.testedPlaques.push(plaque);

  const thereIsNoVehicle = !vehicle;

  const vehicleIsNotFromSelectedBrand =
    vehicle?.versaoVeiculo.modelo.marca.codigo !==
    GlobalVariablesService.marcaVeiculo;

  const thereIsNoMolicar = !vehicle?.versaoVeiculo.tabelaReferencia.some(
    (p) => p.codigoVeiculoTabela.toString().length === molicarLength
  );

  const invalid =
    thereIsNoVehicle || vehicleIsNotFromSelectedBrand || thereIsNoMolicar;

  if (invalid) {
    log(`❌ ${plaque}`);

    return;
  }

  vehicleCollection.push(convertToSaveFormat(vehicle, plaque));

  log(`✅ ${plaque}`);
}

export { testNewPlaque };
