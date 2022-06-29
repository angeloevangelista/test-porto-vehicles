import axios, { AxiosInstance, AxiosResponse } from "axios";

import { toQueryParams } from "../util/toQueryParams";

import {
  PortoTokenAPIResponse,
  PortoVehicleAPIResponse,
  ValoresMercado,
} from "../types";
import { log } from "../util/log";

class PortoApiService {
  private _api: AxiosInstance;
  private static _portoApiService: PortoApiService;

  public static getInstance(): PortoApiService {
    if (!PortoApiService._portoApiService)
      PortoApiService._portoApiService = new PortoApiService();

    return PortoApiService._portoApiService;
  }

  private constructor() {
    this._api = axios.create({
      baseURL: process.env.PORTO_API_BASE_URL,
    });
  }

  async getTokenPorto(): Promise<string> {
    const { data: tokenResponse } = await this._api.post<PortoTokenAPIResponse>(
      "api-gateway/oauth/v2/access-token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        auth: {
          username: String(process.env.PORTO_API_USERNAME),
          password: String(process.env.PORTO_API_PASSWORD),
        },
      }
    );

    return tokenResponse.access_token;
  }

  async getVehicle(
    plaque: string,
    flagZeroKm: "S" | "N"
  ): Promise<ValoresMercado | null> {
    let token: string;

    do {
      try {
        token = await this.getTokenPorto();
      } catch (error) {}
    } while (!token!);

    const queryParams = toQueryParams({
      flagZeroKm,
      placa: plaque,
    });

    const url = `automovel/parceiro-multimercado/v1-1/veiculos${queryParams}`;

    let response: AxiosResponse<PortoVehicleAPIResponse, any> | null;

    try {
      // log(`🔎 ${plaque}`);

      response = await this._api.get<PortoVehicleAPIResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      response = error.response;
    }

    if (response?.status === 200) {
      return response.data.valoresMercado.at(0)!;
    }

    if (response?.status === 429) {
      log(`🕒 Rate Limit exceeded`);
      return await this.getVehicle(plaque, flagZeroKm);
    }

    return null;
  }

  async getVehicleFromMolicar(
    codigoTabelaReferencia: string,
    digitoTabelaReferencia: string,
    anoModelo: number,
    flagZeroKm: "S" | "N"
  ): Promise<ValoresMercado | null> {
    let token: string;

    do {
      try {
        token = await this.getTokenPorto();
      } catch (error) {}
    } while (!token!);

    const queryParams = toQueryParams({
      tipoTabelaReferencia: "3",
      flagZeroKm,
      codigoTabelaReferencia,
      digitoTabelaReferencia,
      anoModelo,
    });

    const url = `automovel/parceiro-multimercado/v1-1/veiculos${queryParams}`;

    let response: AxiosResponse<PortoVehicleAPIResponse, any> | null;

    try {
      response = await this._api.get<PortoVehicleAPIResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      response = error.response;
    }

    if (response?.status === 200) {
      return response.data.valoresMercado.at(0)!;
    }

    if (response?.status === 429) {
      log(`🕒 Rate Limit exceeded`);
      return await this.getVehicleFromMolicar(
        codigoTabelaReferencia,
        digitoTabelaReferencia,
        anoModelo,
        flagZeroKm
      );
    }

    return null;
  }
}

export { PortoApiService };
