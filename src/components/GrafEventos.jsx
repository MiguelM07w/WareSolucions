// src/pages/GrafEventos.jsx
import React, { useState, useEffect } from "react";
import { CContainer, CCard, CCardHeader, CCardBody } from "@coreui/react";
import EventoChart from "../components/EventoChart";
import axios from "axios";

const GrafEventos = () => {
  const [totalEventos, setTotalEventos] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/eventos")
      .then((response) => {
        setTotalEventos(response.data.length);
      })
      .catch((error) => console.error("Error al obtener eventos:", error));
  }, []);

  return (
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader>Monitoreo de Eventos</CCardHeader>
        <CCardBody>
          <p>Total de eventos: {totalEventos}</p>
          <EventoChart />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default GrafEventos;
