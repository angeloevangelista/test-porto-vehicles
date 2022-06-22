import { ValidVehicle } from "../types";

class GlobalVariablesService {
  public static testedPlaques: string[] = [];
  public static validVehicles: ValidVehicle[] = [];
  public static testNewPlaqueTimeoutTime: number = 25;
  public static updateStorageFilesTimeoutTime: number = 4000;
  public static updateStorageFilesTimeout: NodeJS.Timeout | null;

  private constructor() {}
}

export { GlobalVariablesService };
