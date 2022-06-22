import axios, { AxiosInstance, AxiosResponse } from "axios";

import { toQueryParams } from "../util/toQueryParams";

import {
  PortoTokenAPIResponse,
  PortoVehicleAPIResponse,
  ValoresMercado,
} from "../types";

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

  async getVehicle(plaque: string): Promise<ValoresMercado | null> {
    let token: string;

    do {
      try {
        token = await this.getTokenPorto();
      } catch (error) {}
    } while (!token!);

    const queryParams = toQueryParams({
      placa: plaque,
      flagZeroKm: "N",
      montadora: 0,
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

    return null;
  }
}

export { PortoApiService };
