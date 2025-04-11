import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  // Para este ejemplo, controlamos el sensor con id=1.
  const [sensorStatus, setSensorStatus] = useState("activo");
  const [alerts, setAlerts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Actualiza la hora cada segundo.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Obtiene las alertas (datos de sensores) de hoy
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sensores")
      .then((response) => {
        const today = new Date().toDateString();
        const alertsToday = response.data.filter(sensor =>
          new Date(sensor.created_at).toDateString() === today
        );
        setAlerts(alertsToday);
      })
      .catch((error) => {
        console.error("Error al obtener alertas:", error);
      });
  }, []);

  // Función para cambiar el estado del sensor en la API y actualizar el estado local.
  const toggleSensor = () => {
    const newStatus = sensorStatus === "activo" ? "inactivo" : "activo";
    axios
      .put("http://localhost:3001/api/sensores/2", { estado: newStatus })
      .then((response) => {
        setSensorStatus(newStatus);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del sensor:", error);
      });
  };

  return (
    <div className="user-dashboard-container">
      {/* Título centrado */}
      <h2 className="user-dashboard-title">WareSolucions</h2>

      {/* Barra de Hora Actual */}
      <div className="hora-actual-card">
        <p style={{ fontSize: "1rem", margin: 0 }}>{currentTime}</p>
      </div>

      {/* Barra para el Estado del Sensor con botón */}
      <div className="user-card sensor-status-bar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p 
            className={sensorStatus === "activo" ? "user-status-normal" : "user-status-alert"}
            style={{ fontSize: "1rem", margin: 0, color: "#ff0000" }}
          >
            Estado del Sensor: {sensorStatus}
          </p>
          <button 
            className="toggle-sensor-btn"
            onClick={toggleSensor}
            style={{
              padding: "0.3rem 0.8rem",
              fontSize: "0.9rem",
              borderRadius: "4px",
              background: sensorStatus === "activo" ? "#ff0000" : "#008000",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            {sensorStatus === "activo" ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>

      <hr />

      {/* Sección de Alertas Recientes */}
      <div className="dashboard-card alertas-recientes">
        <h3 className="alertas-titulo">Alertas Recientes</h3>
        {alerts.length ? (
          <table className="tabla-alertas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ubicación</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.ubicacion}</td>
                  <td>{alert.descripcion}</td>
                  <td>
                    <span className={alert.estado === "activo" ? "estado-activo" : "estado-inactivo"}>
                      {alert.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="sin-alertas">Sin alertas recientes</p>
        )}
      </div>

      <hr />

      {/* Card de Guía de Seguridad */}
      <div className="user-card security-guide">
        <div className="user-card-header">
          <h3 style={{ color: "red" }}>Guía de Seguridad</h3>
        </div>
        <div className="user-card-body">
          <p>En caso de incendio:</p>
          <ul className="user-guide-list" style={{ listStyle: "inside" }}>
            <li>Evacuar inmediatamente.</li>
            <li>Llamar al 911 o al número de emergencias.</li>
            <li>Siga las rutas de evacuación marcadas.</li>
            <li>No use ascensores.</li>
          </ul>
        </div>
      </div>

      <button 
        className="user-emergency-btn"
      >
        Contactar Emergencias
      </button>
    </div>
  );
};

export default UserDashboard;
