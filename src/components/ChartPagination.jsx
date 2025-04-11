import React, { useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton, CRow, CCol } from "@coreui/react";

// Importar tus gráficas
import UsuarioChart from "./UsuarioChart";
import SensorChart from "./SensorChart";
import EventoChart from "./EventoChart";
import LecturaChart from "./LecturaChart";
import ConfiguracionChart from "./ConfiguracionChart";

const ChartPagination = ({ isDarkMode }) => {
  // Arreglo con la información de cada gráfica y detalles adicionales
  const charts = [
    {
      title: "Gráfica de Usuarios",
      component: <UsuarioChart />,
      cardDetails: (
        <div>
          <p>Información adicional sobre la actividad de usuarios.</p>
        </div>
      ),
    },
    {
      title: "Gráfica de Sensores",
      component: <SensorChart />,
      cardDetails: (
        <div>
          <p>Datos y análisis de sensores en tiempo real.</p>
        </div>
      ),
    },
    {
      title: "Gráfica de Eventos",
      component: <EventoChart />,
      cardDetails: null, // Sin detalles adicionales
    },
    {
      title: "Gráfica de Lecturas",
      component: <LecturaChart />,
      cardDetails: (
        <div>
          <p>Resumen y estadísticas de lecturas recientes.</p>
        </div>
      ),
    },
    {
      title: "Gráfica de Configuración",
      component: <ConfiguracionChart />,
      cardDetails: (
        <div>
          <p>Configuraciones y ajustes actuales del sistema.</p>
        </div>
      ),
    },
  ];

  // Estado para manejar la gráfica actual
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const handlePrev = () => {
    if (currentChartIndex > 0) {
      setCurrentChartIndex(currentChartIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentChartIndex < charts.length - 1) {
      setCurrentChartIndex(currentChartIndex + 1);
    }
  };

  // Definir clases condicionales basadas en el tema
  const cardClass = isDarkMode ? "bg-dark text-white" : "";
  
  return (
    <div>
      {/* Card principal de la gráfica */}
      <CCard className={`mb-4 ${cardClass}`}>
        <CCardHeader className={cardClass}>{charts[currentChartIndex].title}</CCardHeader>
        <CCardBody className={cardClass}>
          {charts[currentChartIndex].component}
        </CCardBody>
      </CCard>

      {/* Card adicional para detalles (si existe) */}
      {charts[currentChartIndex].cardDetails && (
        <CCard className={`mb-4 ${cardClass}`}>
          <CCardHeader className={cardClass}>Detalles Adicionales</CCardHeader>
          <CCardBody className={cardClass}>
            {charts[currentChartIndex].cardDetails}
          </CCardBody>
        </CCard>
      )}

      {/* Navegación entre gráficas */}
      <CRow className="justify-content-between">
        <CCol>
          <CButton onClick={handlePrev} disabled={currentChartIndex === 0}>
            Anterior
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton onClick={handleNext} disabled={currentChartIndex === charts.length - 1}>
            Siguiente
          </CButton>
        </CCol>
      </CRow>
    </div>
  );
};

export default ChartPagination;
