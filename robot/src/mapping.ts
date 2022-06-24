import { GlobalVariablesService } from "./services/globalVariablesService";
import { StorageFileType, ValoresMercado } from "./types";

const convertFunctions: {
  [key in StorageFileType]: (vehicle: ValoresMercado, plaque: string) => any;
} = {
  [StorageFileType.VehiclesWithPlaqueNonZeroKm]: (vehicle, plaque) => ({
    placa: plaque,
    modelo: vehicle.versaoVeiculo.modelo.nomeModelo,
  }),
  [StorageFileType.VehiclesWithPlaqueZeroKm]: (vehicle, plaque) => {
    const { codigoTipoTabela, codigoVeiculoTabela, digitoVeiculoTabela } =
      vehicle.versaoVeiculo.tabelaReferencia
        .filter((p) => p.codigoTipoTabela === 3)
        .at(0) || {};

    return {
      codigoTipoTabela,
      codigoVeiculoTabela,
      digitoVeiculoTabela,

      placa: plaque,
      anoModelo: vehicle.anoModelo,
      flagZeroKm: vehicle.flagZeroKm,
      anoFabricacao: vehicle.anoFabricacao,
      chassi: vehicle.versaoVeiculo.chassi,
      nomeVersao: vehicle.versaoVeiculo.nomeVersao,
      modelo: vehicle.versaoVeiculo.modelo.nomeModelo,
    };
  },
};

const collections: {
  [key in StorageFileType]: any[];
} = {
  [StorageFileType.VehiclesWithPlaqueNonZeroKm]:
    GlobalVariablesService.validVehicleNonZeroKmCollection,

  [StorageFileType.VehiclesWithPlaqueZeroKm]:
    GlobalVariablesService.validVehicleZeroKmCollection,
};

const mapping = {
  convertFunctions,
  collections,
};

export { mapping };
