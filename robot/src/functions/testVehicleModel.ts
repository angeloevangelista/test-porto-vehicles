import { GlobalVariablesService } from "../services/globalVariablesService";
import { PortoApiService } from "../services/portoApiService";
import { VehicleModel } from "../types";
import { log } from "../util/log";

async function testVehicleModel(flagZeroKm: "S" | "N") {
  const vehicleModel =
    GlobalVariablesService.loadedVehicleModelsZeroKmCollection.at(
      GlobalVariablesService.lastIndex++
    ) as VehicleModel;

  const molicar = vehicleModel.molicar
    .split("")
    .slice(1)
    .join("")
    .padEnd(6, "0")
    .substring(0, 6);

  const anosModeloPromises = GlobalVariablesService.modelYearsToTest.map(
    async (anoModelo) => {
      const veiculo = await PortoApiService.getInstance().getVehicleFromMolicar(
        molicar,
        vehicleModel.digitoMolicar,
        anoModelo,
        flagZeroKm
      );

      return veiculo ? anoModelo : null;
    }
  );

  const successfullyYears = await Promise.all(anosModeloPromises);

  const vehicle = {
    anosModelo: successfullyYears.filter((p) => !!p),
    molicar,
    montadora: vehicleModel.montadora,
    descricao: vehicleModel.descricao,
  };

  GlobalVariablesService.validVehicleModelsZeroKmCollection.push(vehicle);

  GlobalVariablesService.loadedVehicleModelsZeroKmCollection =
    GlobalVariablesService.loadedVehicleModelsZeroKmCollection.map((p) =>
      p.molicar === vehicleModel.molicar ? { ...p, tested: true } : p
    );

  vehicleModel.tested = true;
}

export { testVehicleModel };
