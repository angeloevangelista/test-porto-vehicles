import { StorageFileType } from "../types";
import { GlobalVariablesService } from "../services/globalVariablesService";
import { updateStorageFilesForVehiclesWithPlaqueNonZeroKm } from "./updateStorageFiles";
import { exit } from "process";
import { updateStorageFilesForVehiclesWithPlaqueZeroKm } from "./updateStorageFiles/updateStorageFilesForVehiclesWithPlaqueZeroKm";
import { updateStorageFilesForLoadedVehiclesModels } from "./updateStorageFiles/updateStorageFilesForLoadedVehiclesModels";
import { updateStorageFilesForValidatedVehiclesModels } from "./updateStorageFiles/updateStorageFilesForValidatedVehiclesModels";

async function updateStorageFilesTimeoutFunction(
  serializedVehiclesPath: string,
  storageFileType: StorageFileType
): Promise<void> {
  if (GlobalVariablesService.updateStorageFilesTimeout) {
    clearTimeout(GlobalVariablesService.updateStorageFilesTimeout);
    GlobalVariablesService.updateStorageFilesTimeout = null;
  }

  switch (storageFileType) {
    case StorageFileType.VehiclesWithPlaqueNonZeroKm:
      await updateStorageFilesForVehiclesWithPlaqueNonZeroKm(
        serializedVehiclesPath
      );
      break;

    case StorageFileType.VehiclesWithPlaqueZeroKm:
      await updateStorageFilesForVehiclesWithPlaqueZeroKm(
        serializedVehiclesPath
      );
      break;

    case StorageFileType.LoadedVehiclesModels:
      await updateStorageFilesForLoadedVehiclesModels(serializedVehiclesPath);
      break;

    case StorageFileType.ValidatedVehiclesModels:
      await updateStorageFilesForValidatedVehiclesModels(
        serializedVehiclesPath
      );
      break;

    default:
      throw new Error(`Invalid storageFileType: ${storageFileType}`);
  }

  GlobalVariablesService.updateStorageFilesTimeout = setTimeout(
    () =>
      updateStorageFilesTimeoutFunction(
        serializedVehiclesPath,
        storageFileType
      ),
    GlobalVariablesService.updateStorageFilesTimeoutTime
  );
}

export { updateStorageFilesTimeoutFunction };
