import "dotenv/config";

import path from "path";
import { AxiosError } from "axios";

import { log } from "./util/log";
import { checkIfExistsAndCreate } from "./util/checkIfExistsAndCreate";
import { recoverAlreadySavedData } from "./functions/recoverAlreadySavedData";
import { GlobalVariablesService } from "./services/globalVariablesService";
import { updateStorageFilesTimeoutFunction } from "./functions/updateStorageFilesTimeoutFunction";
import { testNewPlaque } from "./functions/testNewPlaque";
import { MarcaVeiculoEnum, StorageFileType, ValidVehicle } from "./types";
import { mapping } from "./mapping";

const serializedVehiclesPath = path.resolve(
  __dirname,
  "..",
  "files",
  "validated-vehicles.json"
);

async function doStuff() {
  GlobalVariablesService.marcaVeiculo = MarcaVeiculoEnum.Audi;

  checkIfExistsAndCreate(serializedVehiclesPath, []);

  await recoverAlreadySavedData(
    serializedVehiclesPath,
    GlobalVariablesService.validVehicleNonZeroKmCollection
  );

  updateStorageFilesTimeoutFunction(
    serializedVehiclesPath,
    StorageFileType.VehiclesWithPlaqueZeroKm
  );

  setInterval(() => {
    try {
      testNewPlaque<ValidVehicle>(
        mapping.collections[StorageFileType.VehiclesWithPlaqueZeroKm],
        "S",
        mapping.convertFunctions[StorageFileType.VehiclesWithPlaqueZeroKm]
      );
    } catch (error) {}
  }, GlobalVariablesService.testNewPlaqueTimeoutTime);
}

doStuff().catch((error: any) => {
  log({
    error,
    ...(error instanceof AxiosError
      ? {
          request: error.request,
          errors: error.response,
        }
      : error),
  });
});
