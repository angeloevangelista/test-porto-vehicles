import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import NewModels from "./pages/NewModels";
import UsedVehicles from "./pages/UsedVehicles";
import NewVehicles from "./pages/NewVehicles";
import NewVehiclesGrid from "./pages/NewVehiclesGrid";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="App">
        <div className="title-container">
          <strong>Placas da felicidade</strong>
          <small>Algum cabeção apagou o do dontpad 😀</small>
        </div>

        <Routes>
          <Route path="/" element={<UsedVehicles />} />
          <Route path="/zero-km" element={<NewVehicles />} />
          <Route path="/zero-km-models" element={<NewModels />} />
          <Route path="/zero-km-grid" element={<NewVehiclesGrid />} />
        </Routes>

        <footer className="footer">
          <Link to={"/"} className="page-button">
            Usados
          </Link>

          <Link to={"/zero-km"} className="page-button">
            0 km
          </Link>

          <Link to={"/zero-km-models"} className="page-button">
            0 km Models
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
