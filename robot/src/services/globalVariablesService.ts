import { MarcaVeiculoEnum, ValidVehicle } from "../types";

class GlobalVariablesService {
  public static testedPlaques: string[] = [];
  public static testNewPlaqueTimeoutTime: number = 25;
  public static updateStorageFilesTimeoutTime: number = 4000;
  public static updateStorageFilesTimeout: NodeJS.Timeout | null;
  public static marcaVeiculo: MarcaVeiculoEnum;

  public static validVehicleNonZeroKmCollection: ValidVehicle[] = [];
  public static validVehicleZeroKmCollection: any[] = [];

  private constructor() {}
}

export { GlobalVariablesService };
