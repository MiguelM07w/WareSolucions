// src/pages/GrafSensores.jsx
import React, { useState, useEffect } from "react";
import { CContainer, CCard, CCardHeader, CCardBody } from "@coreui/react";
import SensorChart from "../components/SensorChart";
import axios from "axios";

const GrafSensores = () => {
  const [activeSensorsCount, setActiveSensorsCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/sensores")
      .then((response) => {
        const sensores = response.data;
        // Se asume que cada sensor tiene un campo 'activo' (booleano)
        const activos = sensores.filter(sensor => sensor.activo === true);
        setActiveSensorsCount(activos.length);
      })
      .catch((error) => console.error("Error al obtener sensores:", error));
  }, []);

  return (
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader>Monitoreo de Sensores</CCardHeader>
        <CCardBody>
          <p>Sensores activos: {activeSensorsCount}</p>
          <SensorChart />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default GrafSensores;
