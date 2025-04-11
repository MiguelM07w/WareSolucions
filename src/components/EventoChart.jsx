// src/components/EventoChart.jsx
import React, { useState, useEffect } from "react";
import { CChartBar } from "@coreui/react-chartjs";
import axios from "axios";

const EventoChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Eventos por Tipo",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/eventos");
        const eventos = response.data;

        // Agrupar eventos por su campo 'tipo'
        const eventosPorTipo = {};
        eventos.forEach((evento) => {
          const tipo = evento.tipo || "Desconocido";
          if (!eventosPorTipo[tipo]) {
            eventosPorTipo[tipo] = 0;
          }
          eventosPorTipo[tipo]++;
        });

        setChartData({
          labels: Object.keys(eventosPorTipo),
          datasets: [
            {
              label: "Eventos por Tipo",
              data: Object.values(eventosPorTipo),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "20px" }}>
      <h3 className="text-center">Eventos por Tipo</h3>
      <CChartBar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export default EventoChart;
