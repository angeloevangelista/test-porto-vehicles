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

  do {
    plaque = geradorPlacaVeiculo();
  } while (GlobalVariablesService.testedPlaques.includes(plaque));

  const vehicle = await portoApiService.getVehicle(plaque, flagZeroKm);

  GlobalVariablesService.testedPlaques.push(plaque);

  const thereIsNoVehicle = !vehicle;

  const vehicleIsNotVolkswagen =
    vehicle?.versaoVeiculo.modelo.marca.codigo !== MarcaVeiculoEnum.Volkswagen;

  const thereIsNoMolicar = !vehicle?.versaoVeiculo.tabelaReferencia.some(
    (p) => p.codigoVeiculoTabela.toString().length === 7
  );

  const invalid =
    thereIsNoVehicle || vehicleIsNotVolkswagen || thereIsNoMolicar;

  if (invalid) {
    log(`❌ ${plaque}`);

    return;
  }

  vehicleCollection.push(convertToSaveFormat(vehicle, plaque));

  log(`✅ ${plaque}`);
}

export { testNewPlaque };
