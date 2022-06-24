import fs from "fs";

import { log } from "../../util/log";
import { ValidVehicle } from "../../types";
import { GlobalVariablesService } from "../../services/globalVariablesService";

async function updateStorageFilesForVehiclesWithPlaqueNonZeroKm(path: string) {
  log("💾 UPDATING");

  const alreadySavedVehicles: ValidVehicle[] = JSON.parse(
    String(fs.readFileSync(path))
  );

  const newSavedVehiclesSinceLastSave = alreadySavedVehicles.filter(
    (alreadySavedVehicle) =>
      !GlobalVariablesService.validVehicleNonZeroKmCollection.some(
        (validatedVehicle: ValidVehicle) =>
          validatedVehicle.placa === alreadySavedVehicle.placa
      )
  );

  GlobalVariablesService.validVehicleNonZeroKmCollection.push(
    ...newSavedVehiclesSinceLastSave
  );

  await fs.promises.writeFile(
    path,
    JSON.stringify(
      GlobalVariablesService.validVehicleNonZeroKmCollection,
      null,
      2
    )
  );
}

export { updateStorageFilesForVehiclesWithPlaqueNonZeroKm };
