export enum StorageFileType {
  VehiclesWithPlaqueZeroKm,
  VehiclesWithPlaqueNonZeroKm,
}

export interface Vehicle {
  Codigo: number;
  Descricao: string;
}

export interface PortoTokenAPIResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PortoVehicleAPIResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
  valoresMercado: ValoresMercado[];
}

export interface ValoresMercado {
  codigoVersao: number;
  anoModelo: number;
  anoFabricacao: number;
  flagZeroKm: string;
  valorMercado: number;
  mesReferencia: number;
  anoReferencia: number;
  versaoVeiculo: VersaoVeiculo;
  codigoVersaoLegado: number;
}

export interface VersaoVeiculo {
  nomeVersao: string;
  flagVeiculoPCD: string;
  flagVeiculoBlindado: string;
  tipoCombustivel: TipoCambio;
  tipoCambio: TipoCambio;
  tabelaReferencia: TabelaReferencia[];
  chassi: string;
  modelo: Modelo;
}

export interface Modelo {
  codigoModelo: number;
  nomeModelo: string;
  marca: MarcaVeiculo;
}

export interface MarcaVeiculo {
  codigo: MarcaVeiculoEnum;
}

export enum MarcaVeiculoEnum {
  Volkswagen = 1,
  Audi = 63,
  Renault = 75,
}

export interface TipoCambio {
  codigo: number;
}

export interface TabelaReferencia {
  codigoTipoTabela: number;
  codigoVeiculoTabela: number;
  digitoVeiculoTabela: number;
}

export interface ValidVehicle {
  placa: string;
  modelo: string;
}
