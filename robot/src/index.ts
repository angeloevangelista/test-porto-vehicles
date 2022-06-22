import "dotenv/config";

import path from "path";
import { AxiosError } from "axios";

import { log } from "./util/log";
import { testNewPlaque } from "./functions/testNewPlaque";
import { updateStorageFiles } from "./functions/updateStorageFiles";
import { checkIfExistsAndCreate } from "./util/checkIfExistsAndCreate";
import { recoverAlreadySavedData } from "./functions/recoverAlreadySavedData";
import { GlobalVariablesService } from "./services/globalVariablesService";

const serializedVehiclesPath = path.resolve(
  __dirname,
  "..",
  "files",
  "validated-vehicles.json"
);

async function doStuff() {
  checkIfExistsAndCreate(serializedVehiclesPath, []);

  await recoverAlreadySavedData(serializedVehiclesPath);

  updateStorageFilesTimeoutFunction();

  setInterval(() => {
    try {
      testNewPlaque();
    } catch (error) {}
  }, GlobalVariablesService.testNewPlaqueTimeoutTime);
}

async function updateStorageFilesTimeoutFunction(): Promise<void> {
  if (GlobalVariablesService.updateStorageFilesTimeout) {
    clearTimeout(GlobalVariablesService.updateStorageFilesTimeout);
    GlobalVariablesService.updateStorageFilesTimeout = null;
  }

  await updateStorageFiles(serializedVehiclesPath);

  GlobalVariablesService.updateStorageFilesTimeout = setTimeout(
    updateStorageFilesTimeoutFunction,
    GlobalVariablesService.updateStorageFilesTimeoutTime
  );
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
