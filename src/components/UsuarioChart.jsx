import React, { useState, useEffect } from "react";
import { CChartLine } from "@coreui/react-chartjs";
import axios from "axios";

const UsuarioChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Usuarios registrados por día",
        data: [],
        fill: false,
        borderColor: "#007bff",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#007bff",
        tension: 0.3, // Suaviza la línea
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener todos los usuarios
        const { data: usuarios } = await axios.get("http://localhost:3001/api/usuarios");

        // 2. Agrupar usuarios por día (asumiendo que hay un campo 'created_at')
        const registrosPorDia = {};
        usuarios.forEach((user) => {
          // Ajusta 'created_at' al campo real que uses en tu DB
          const fechaRegistro = new Date(user.created_at);
          // Tomamos sólo la parte 'YYYY-MM-DD'
          const diaString = fechaRegistro.toISOString().split("T")[0];
          if (!registrosPorDia[diaString]) {
            registrosPorDia[diaString] = 0;
          }
          registrosPorDia[diaString]++;
        });

        // 3. Ordenar las fechas para mostrarlas en el eje X de manera cronológica
        const fechasOrdenadas = Object.keys(registrosPorDia).sort();

        // 4. Crear el array con el número de registros diarios
        const conteos = fechasOrdenadas.map((fecha) => registrosPorDia[fecha]);

        // 5. Actualizar el estado de la gráfica
        setChartData({
          labels: fechasOrdenadas,
          datasets: [
            {
              label: "Usuarios registrados por día",
              data: conteos,
              fill: false,
              borderColor: "#007bff",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "#007bff",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener datos de usuarios:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "20px" }}>
      <h3 className="text-center">Usuarios Registrados</h3>
      <CChartLine
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default UsuarioChart;
