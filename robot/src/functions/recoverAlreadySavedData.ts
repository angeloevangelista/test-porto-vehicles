import fs from "fs";

import { GlobalVariablesService } from "../services/globalVariablesService";

async function recoverAlreadySavedData(path: string) {
  GlobalVariablesService.validVehicles.push(
    ...JSON.parse(String(fs.readFileSync(path)))
  );

  GlobalVariablesService.testedPlaques.push(
    ...GlobalVariablesService.validVehicles.map((p) => p.placa)
  );
}

export { recoverAlreadySavedData };
