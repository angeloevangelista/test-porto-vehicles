import "dotenv/config";

import fs from "fs";
import path from "path";
import { AxiosError } from "axios";

import { log } from "./util/log";
import { checkIfExistsAndCreate } from "./util/checkIfExistsAndCreate";
import { recoverAlreadySavedData } from "./functions/recoverAlreadySavedData";
import { GlobalVariablesService } from "./services/globalVariablesService";
import { updateStorageFilesTimeoutFunction } from "./functions/updateStorageFilesTimeoutFunction";
import { testNewPlaque } from "./functions/testNewPlaque";
import {
  MarcaVeiculoEnum,
  StorageFileType,
  ValidVehicle,
  VehicleModel,
} from "./types";
import { mapping } from "./mapping";
import { PortoApiService } from "./services/portoApiService";
import { testVehicleModel } from "./functions/testVehicleModel";

const serializedVehiclesPath = path.resolve(
  __dirname,
  "..",
  "files",
  "validated-vehicles.json"
);

const vehiclesModelPath = path.resolve(
  __dirname,
  "..",
  "files",
  "vehicles-model.json"
);

const validatedVehiclesModelPath = path.resolve(
  __dirname,
  "..",
  "files",
  "validated-vehicles-model.json"
);

async function doStuff() {
  // await consultaPorPlaca();
  await consultaPorModelo();
  // 2517
}

async function consultaPorModelo() {
  GlobalVariablesService.loadedVehicleModelsZeroKmCollection = JSON.parse(
    String(fs.readFileSync(vehiclesModelPath))
  );

  GlobalVariablesService.loadedVehicleModelsZeroKmCollection =
    GlobalVariablesService.loadedVehicleModelsZeroKmCollection.filter(
      (p) => !p.tested && p.montadora === "VOLKSWAGEN"
    );

  checkIfExistsAndCreate(validatedVehiclesModelPath, []);

  updateStorageFilesTimeoutFunction(
    vehiclesModelPath,
    StorageFileType.LoadedVehiclesModels
  );

  updateStorageFilesTimeoutFunction(
    validatedVehiclesModelPath,
    StorageFileType.ValidatedVehiclesModels
  );

  const testVehicleModelInterval = setInterval(async () => {
    try {
      await testVehicleModel("S");

      if (
        GlobalVariablesService.lastIndex ===
        GlobalVariablesService.loadedVehicleModelsZeroKmCollection.length
      )
        clearInterval(testVehicleModelInterval);
    } catch (error) {}
  }, GlobalVariablesService.testNewPlaqueTimeoutTime);
}

async function consultaPorPlaca() {
  GlobalVariablesService.marcaVeiculo = MarcaVeiculoEnum.Volkswagen;

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
        "N",
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
