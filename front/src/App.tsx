import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import "./App.css";

import NewVehicles from "./pages/NewVehicles";
import UsedVehicles from "./pages/UsedVehicles";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="title-container">
          <strong>Placas da felicidade</strong>
          <small>Algum cabeção apagou o do dontpad 😀</small>
        </div>

        <Routes>
          <Route path="/" element={<UsedVehicles />} />
          <Route path="/zero-km" element={<NewVehicles />} />
        </Routes>

        <footer className="footer">
          <Link to={"/"} className="page-button">
            Usados
          </Link>

          <Link to={"/zero-km"} className="page-button">
            0 km
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
