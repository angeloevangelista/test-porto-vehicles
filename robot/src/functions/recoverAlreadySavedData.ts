import fs from "fs";

import { GlobalVariablesService } from "../services/globalVariablesService";

async function recoverAlreadySavedData(path: string, collection: any[]) {
  collection.push(...JSON.parse(String(fs.readFileSync(path))));

  GlobalVariablesService.testedPlaques.push(...collection.map((p) => p.placa));
}

export { recoverAlreadySavedData };
