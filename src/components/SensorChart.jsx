import React, { useState, useEffect } from 'react';
import { CChartBar } from '@coreui/react-chartjs';
import axios from 'axios';

const SensorChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const { data: sensores } = await axios.get('http://localhost:3001/api/sensores');

        // Agrupar sensores por día (según "created_at") contando los activos e inactivos
        const registrosActivos = {};
        const registrosInactivos = {};

        sensores.forEach(sensor => {
          const fecha = new Date(sensor.created_at).toLocaleDateString();
          if (sensor.estado === 'activo') {
            registrosActivos[fecha] = (registrosActivos[fecha] || 0) + 1;
          } else {
            registrosInactivos[fecha] = (registrosInactivos[fecha] || 0) + 1;
          }
        });

        // Obtener todas las fechas únicas y ordenarlas cronológicamente
        const fechasActivos = Object.keys(registrosActivos);
        const fechasInactivos = Object.keys(registrosInactivos);
        const todasFechas = Array.from(new Set([...fechasActivos, ...fechasInactivos])).sort((a, b) => new Date(a) - new Date(b));

        const countsActivos = todasFechas.map(fecha => registrosActivos[fecha] || 0);
        const countsInactivos = todasFechas.map(fecha => registrosInactivos[fecha] || 0);

        setChartData({
          labels: todasFechas,
          datasets: [
            {
              label: 'Sensores Activos',
              data: countsActivos,
              backgroundColor: 'rgba(40, 167, 69, 0.5)',
              borderColor: 'rgba(40, 167, 69, 1)',
              borderWidth: 1,
            },
            {
              label: 'Sensores Inactivos',
              data: countsInactivos,
              backgroundColor: 'rgba(220, 53, 69, 0.5)',
              borderColor: 'rgba(220, 53, 69, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener datos de sensores:', error);
      }
    };

    fetchSensorData();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto' }}>
      <h3 className="text-center">Actividad Diaria de Sensores</h3>
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

export default SensorChart;
