// src/pages/GrafConfiguraciones.jsx
import React, { useState, useEffect } from "react";
import { CContainer, CCard, CCardHeader, CCardBody } from "@coreui/react";
import ConfiguracionChart from "../components/ConfiguracionChart";
import axios from "axios";

const GrafConfiguraciones = () => {
  const [totalConfigs, setTotalConfigs] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/configuraciones")
      .then((response) => {
        setTotalConfigs(response.data.length);
      })
      .catch((error) => console.error("Error al obtener configuraciones:", error));
  }, []);

  return (
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader>Monitoreo de Configuraciones</CCardHeader>
        <CCardBody>
          <p>Total de configuraciones: {totalConfigs}</p>
          <ConfiguracionChart />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default GrafConfiguraciones;
