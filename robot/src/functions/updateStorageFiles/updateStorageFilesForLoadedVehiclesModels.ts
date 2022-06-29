import fs from "fs";

import { log } from "../../util/log";
import { GlobalVariablesService } from "../../services/globalVariablesService";

async function updateStorageFilesForLoadedVehiclesModels(path: string) {
  log("💾 UPDATING");

  await fs.promises.writeFile(
    path,
    JSON.stringify(
      GlobalVariablesService.loadedVehicleModelsZeroKmCollection,
      null,
      2
    )
  );
}

export { updateStorageFilesForLoadedVehiclesModels };
