import fs from "fs";

import { log } from "../../util/log";
import { GlobalVariablesService } from "../../services/globalVariablesService";

async function updateStorageFilesForValidatedVehiclesModels(path: string) {
  log("💾 UPDATING");

  await fs.promises.writeFile(
    path,
    JSON.stringify(
      GlobalVariablesService.validVehicleModelsZeroKmCollection,
      null,
      2
    )
  );
}

export { updateStorageFilesForValidatedVehiclesModels };
