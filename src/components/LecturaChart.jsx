// src/components/LecturaChart.jsx
import React, { useState, useEffect } from "react";
import { CChartLine } from "@coreui/react-chartjs";
import axios from "axios";

const LecturaChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Valor de Lecturas",
        data: [],
        fill: false,
        borderColor: "#36A2EB",
        borderWidth: 2,
        tension: 0.4,           // Curvatura de la línea
        pointRadius: 4,
        pointBackgroundColor: "#36A2EB",
      },
    ],
  });

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/lecturas");
        const lecturas = response.data;
        
        // Suponiendo que cada lectura tiene un campo "timestamp" y "valor"
        // Ordenar las lecturas cronológicamente
        lecturas.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Extraer las etiquetas (horas) y los valores
        const labels = lecturas.map((lectura) => {
          const date = new Date(lectura.timestamp);
          return date.toLocaleTimeString(); // Puedes cambiar a toLocaleDateString() si prefieres ver la fecha
        });
        const dataValues = lecturas.map((lectura) => lectura.valor);

        setChartData({
          labels,
          datasets: [
            {
              label: "Valor de Lecturas",
              data: dataValues,
              fill: false,
              borderColor: "#36A2EB",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "#36A2EB",
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener lecturas:", error);
      }
    };

    fetchLecturas();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "20px" }}>
      <h3 className="text-center">Evolución de Lecturas</h3>
      <CChartLine
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

export default LecturaChart;
