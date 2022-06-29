import { MarcaVeiculoEnum, ValidVehicle, VehicleModel } from "../types";

class GlobalVariablesService {
  public static testedPlaques: string[] = [];
  public static testNewPlaqueTimeoutTime: number = 25;
  public static updateStorageFilesTimeoutTime: number = 4000;
  public static updateStorageFilesTimeout: NodeJS.Timeout | null;
  public static marcaVeiculo: MarcaVeiculoEnum;

  public static validVehicleNonZeroKmCollection: ValidVehicle[] = [];
  public static validVehicleZeroKmCollection: any[] = [];
  public static loadedVehicleModelsZeroKmCollection: VehicleModel[] = [];
  public static validVehicleModelsZeroKmCollection: any[] = [];

  public static modelYearsToTest: number[] = [2021, 2022];
  public static lastIndex: number = 0;

  private constructor() {}
}

export { GlobalVariablesService };
