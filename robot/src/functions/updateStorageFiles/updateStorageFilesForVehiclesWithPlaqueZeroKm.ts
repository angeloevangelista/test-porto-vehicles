import fs from "fs";

import { log } from "../../util/log";
import { GlobalVariablesService } from "../../services/globalVariablesService";

async function updateStorageFilesForVehiclesWithPlaqueZeroKm(path: string) {
  log("💾 UPDATING");

  const alreadySavedVehicles: any[] = JSON.parse(String(fs.readFileSync(path)));

  const newSavedVehiclesSinceLastSave = alreadySavedVehicles.filter(
    (alreadySavedVehicle) =>
      !GlobalVariablesService.validVehicleZeroKmCollection.some(
        (validatedVehicle: any) =>
          validatedVehicle.placa === alreadySavedVehicle.placa
      )
  );

  GlobalVariablesService.validVehicleZeroKmCollection.push(
    ...newSavedVehiclesSinceLastSave
  );

  await fs.promises.writeFile(
    path,
    JSON.stringify(GlobalVariablesService.validVehicleZeroKmCollection, null, 2)
  );
}

export { updateStorageFilesForVehiclesWithPlaqueZeroKm };
