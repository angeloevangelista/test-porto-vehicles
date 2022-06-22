import fs from "fs";

import { log } from "../util/log";
import { ValidVehicle } from "../types";
import { GlobalVariablesService } from "../services/globalVariablesService";

async function updateStorageFiles(path: string) {
  log("💾 UPDATING");

  const alreadySavedVehicles: ValidVehicle[] = JSON.parse(
    String(fs.readFileSync(path))
  );

  const newSavedVehiclesSinceLastSave = alreadySavedVehicles.filter(
    (alreadySavedVehicle) =>
      !GlobalVariablesService.validVehicles.some(
        (validatedVehicle: ValidVehicle) =>
          validatedVehicle.placa === alreadySavedVehicle.placa
      )
  );

  GlobalVariablesService.validVehicles.push(...newSavedVehiclesSinceLastSave);

  await fs.promises.writeFile(
    path,
    JSON.stringify(GlobalVariablesService.validVehicles, null, 2)
  );
}

export { updateStorageFiles };
