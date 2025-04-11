// src/components/ConfiguracionChart.jsx
import React, { useState, useEffect } from 'react';
import { CChartBar } from '@coreui/react-chartjs';
import axios from 'axios';

const ConfiguracionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Valor de Configuraciones',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchConfiguraciones = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/configuracion');
        const configs = response.data;
        
        // Procesar datos: extraer "clave" y valor numérico (si es posible)
        const labels = [];
        const data = [];
        configs.forEach(config => {
          const numericValue = Number(config.valor);
          // Solo si el valor es numérico (no NaN)
          if (!isNaN(numericValue)) {
            labels.push(config.clave);
            data.push(numericValue);
          }
        });
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Valor de Configuraciones',
              data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error al obtener configuraciones:', error);
      }
    };

    fetchConfiguraciones();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '20px' }}>
      <h3 className="text-center">Configuraciones Numéricas</h3>
      <CChartBar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
};

export default ConfiguracionChart;
