import axios from "axios";
import { AiOutlineCar } from "react-icons/ai";
import { BiSelectMultiple } from "react-icons/bi";
import React, { useCallback, useEffect, useRef } from "react";

import loaderSvg from "../../assets/svg/loader.svg";
import { toast } from "react-toastify";

export interface Model {
  id: string;
  anosmodelo: string;
  molicar: string;
  montadora: "VOLKSWAGEN" | "AUDI";
  descricao: string;
  modelo: string;
  usado: boolean;
}

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const NewModels: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [models, setModels] = React.useState<Model[]>([]);
  const secretHiddenInputRef = useRef<HTMLInputElement | null>(null);

  const loadModels = useCallback(async () => {
    setLoading(true);

    try {
      const modelsResponse = await axios.get<Model[]>(`${apiBaseUrl}/models`);

      setModels(modelsResponse.data.sort((a) => (a.usado ? 1 : -1)));
    } catch (error) {
      console.error(error);

      toast.error("Deu ruim rapaz!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const markVehicleAsUsed = useCallback(
    async (id: string) => {
      const foundModel = models.find((v) => v.id === id);

      navigator.clipboard.writeText(foundModel!.descricao);

      foundModel!.usado = true;

      const filteredModels = models
        .map((p) => (p.id === foundModel?.id ? foundModel : p))
        .sort((a) => (a.usado ? 1 : -1));

      setModels(filteredModels);

      await axios.delete<Model[]>(`${apiBaseUrl}/models/${id}`);

      loadModels();
    },
    [loadModels, models]
  );

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return (
    <>
      <header className="page-header">
        <AiOutlineCar size={24} color="#7e7e7e" />

        <strong>Modelos veículos novos</strong>
      </header>

      <input type="hidden" ref={secretHiddenInputRef} />

      {loading && (
        <div className="loader-container">
          <img
            src={loaderSvg}
            alt="Loader bonitão que o Angelo teve que copiar inteiro pro código porque é um SVG boladão"
          />
        </div>
      )}

      {!!models.length && (
        <ul className="model-list">
          {models.map((model) => (
            <li
              key={model.id}
              data-used={model.usado}
              className={`model-item ${model.usado ? "used" : ""}`}
            >
              <div>
                <div className="anos-modelo">
                  <strong>{model.modelo}</strong>

                  <div className="anos-container">
                    {model.anosmodelo.split(",").map((ano) => (
                      <span key={ano}>{ano}</span>
                    ))}
                  </div>
                </div>

                <small>{model.descricao}</small>
              </div>

              <button
                disabled={model.usado}
                onClick={() => markVehicleAsUsed(model.id)}
              >
                <BiSelectMultiple size={24} color="#7e7e7e" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default NewModels;
