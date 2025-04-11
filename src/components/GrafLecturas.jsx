// src/pages/GrafLecturas.jsx
import React, { useState, useEffect } from "react";
import { CContainer, CCard, CCardHeader, CCardBody } from "@coreui/react";
import LecturaChart from "../components/LecturaChart";
import axios from "axios";

const GrafLecturas = () => {
  const [totalLecturas, setTotalLecturas] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/lecturas")
      .then((response) => {
        setTotalLecturas(response.data.length);
      })
      .catch((error) => console.error("Error al obtener lecturas:", error));
  }, []);

  return (
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader>Monitoreo de Lecturas</CCardHeader>
        <CCardBody>
          <p>Total de lecturas: {totalLecturas}</p>
          <LecturaChart />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default GrafLecturas;

