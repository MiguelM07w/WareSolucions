import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CNavItem,
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CHeader,
  CHeaderNav,
  CButton,
} from "@coreui/react";
import {
  cilSpeedometer,
  cilUser,
  cilFire,
  cilSettings,
  cilExitToApp,
  cilBell,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import ChartPagination from "./ChartPagination";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Inicializa isDarkMode desde localStorage (si existe)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sensorStats, setSensorStats] = useState({ total: 0, active: 0, alerts: 0 });
  const [todayUsersCount, setTodayUsersCount] = useState(0);

  // Estados para alertas e incidentes usando endpoints
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [incidentHistory, setIncidentHistory] = useState([]);

  // Estado para la paginación del historial de incidentes
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(incidentHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncidentHistory = incidentHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Notificaciones basadas en las estadísticas (se mostrarán solo si no han sido leídas)
  const [notificationsData, setNotificationsData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Guarda el modo oscuro en localStorage y actualiza la clase del body
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);

  // Obtener sensores desde la API para estadísticas
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sensores")
      .then((response) => {
        const sensores = response.data;
        const total = sensores.length;
        const active = sensores.filter(sensor => sensor.estado === "activo").length;
        setSensorStats({ total, active, alerts: sensorStats.alerts });
      })
      .catch((error) => {
        console.error("Error al obtener sensores:", error);
      });
  }, []);

  // Cargar usuarios (estadística de usuarios registrados hoy)
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/usuarios")
      .then((response) => {
        const allUsers = response.data;
        const today = new Date().toDateString();
        const usersToday = allUsers.filter((user) => {
          const userDate = new Date(user.created_at).toDateString();
          return userDate === today;
        });
        setTodayUsersCount(usersToday.length);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  }, []);

  // Obtener alertas recientes desde la API y filtrar solo los datos de hoy
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sensores")
      .then((response) => {
        const today = new Date().toDateString();
        const alertsToday = response.data.filter(sensor => 
          new Date(sensor.created_at).toDateString() === today
        );
        setRecentAlerts(alertsToday);
      })
      .catch((error) => {
        console.error("Error al obtener alertas:", error);
      });
  }, []);

  // Obtener historial de incidentes desde la API (todos los registros)
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/sensores")
      .then((response) => {
        setIncidentHistory(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener historial de incidentes:", error);
      });
  }, []);

  // Función para obtener notificaciones ya leídas desde localStorage
  const getReadNotifications = () => {
    const read = localStorage.getItem("readNotifications");
    return read ? JSON.parse(read) : [];
  };

  // Marca una notificación como leída en localStorage
  const markNotificationAsRead = (notif) => {
    const readNotifs = getReadNotifications();
    if (!readNotifs.includes(notif)) {
      readNotifs.push(notif);
      localStorage.setItem("readNotifications", JSON.stringify(readNotifs));
    }
  };

  // Actualiza las notificaciones basadas en la información de las 3 cards y filtra las ya leídas
  useEffect(() => {
    const newNotifications = [];
    const readNotifs = getReadNotifications();
    const notif1 = `Total de Sensores: ${sensorStats.total}`;
    const notif2 = `Sensores Activos: ${sensorStats.active}`;
    const notif3 = `Usuarios Registrados (Hoy): ${todayUsersCount}`;
    if (sensorStats.total > 0 && !readNotifs.includes(notif1)) {
      newNotifications.push(notif1);
    }
    if (sensorStats.active > 0 && !readNotifs.includes(notif2)) {
      newNotifications.push(notif2);
    }
    if (todayUsersCount > 0 && !readNotifs.includes(notif3)) {
      newNotifications.push(notif3);
    }
    setNotificationsData(newNotifications);
  }, [sensorStats, todayUsersCount]);

  // Al hacer clic en una notificación, se marca como leída y se elimina de la lista
  const removeNotification = (index) => {
    setNotificationsData((prev) => {
      const notif = prev[index];
      markNotificationAsRead(notif);
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setShowNotifications(false);
      }
      return updated;
    });
  };

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  // Alterna la visibilidad del dropdown de notificaciones
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Función para exportar ambas tablas a un documento Word
  const exportToWord = () => {
    const alertsTable = document.getElementById("alertTable")?.outerHTML || "";
    const incidentsTable = document.getElementById("incidentTable")?.outerHTML || "";
    const html = `
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <h2>Alertas Recientes</h2>
        ${alertsTable}
        <h2>Historial de Incidentes</h2>
        ${incidentsTable}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tablas.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estilos personalizados para cards, headers y botones
  const customCardStyle = {
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
  };

  const customHeaderStyle = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    padding: "0.8rem",
    borderBottom: "2px solid #ccc",
  };

  const customButtonStyle = {
    borderRadius: "8px",
    fontWeight: "600",
    padding: "0.5rem 1rem",
  };

  const headerStyle = {
    backgroundColor: isDarkMode ? "#2d3035" : "#f8f9fa",
    border: isDarkMode ? "1px solid #444" : "none",
    color: isDarkMode ? "#fff" : "#212529",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    marginTop: "-20px",
    flexWrap: "wrap",
    position: "relative",
  };

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "250px",
    backgroundColor: isDarkMode ? "#2d3035" : "#f8f9fa",
    border: isDarkMode ? "1px solid #444" : "none",
    transform: sidebarVisible ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
    zIndex: 9998,
  };

  const menuButtonStyle = {
    position: "fixed",
    top: 10,
    left: 10,
    zIndex: 9999,
  };

  const mainContainerStyle = {
    marginTop: "20px",
    transition: "margin-left 0.3s ease",
  };

  const notificationDropdownStyle = {
    position: "absolute",
    top: "60px",
    right: "20px",
    backgroundColor: isDarkMode ? "#2d3035" : "#fff",
    border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    zIndex: 10000,
    width: "250px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  return (
    <div>
      {/* Botón para colapsar/expandir sidebar */}
      <CButton
        color="secondary"
        onClick={() => setSidebarVisible(!sidebarVisible)}
        style={{ ...menuButtonStyle, ...customButtonStyle }}
      >
        <CIcon icon={cilMenu} style={{ color: isDarkMode ? "#fff" : undefined }} />
      </CButton>

      {/* Sidebar */}
      <CSidebar style={sidebarStyle}>
        <CSidebarNav>
          <CNavTitle style={{ color: isDarkMode ? "#fff" : undefined, fontWeight: "bold" }}>
            Administrador
          </CNavTitle>
          <CNavItem href="/admin" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilSpeedometer} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Dashboard
          </CNavItem>
          <CNavItem href="/admin/usuarios" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilUser} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Usuarios
          </CNavItem>
          <CNavItem href="/admin/sensores" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilFire} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Sensores
          </CNavItem>
          <CNavItem href="/admin/configuracion" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilSettings} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Configuración
          </CNavItem>
          <CNavItem href="/admin/incidentes" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilBell} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Incidentes
          </CNavItem>
          <CNavItem href="/admin/lecturas" style={{ color: isDarkMode ? "#fff" : undefined }}>
            <CIcon icon={cilList} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
            Lecturas
          </CNavItem>
          <CNavItem style={{ cursor: "pointer" }}>
            <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", color: isDarkMode ? "#fff" : undefined }}>
              <CIcon icon={cilExitToApp} className="me-2" style={{ color: isDarkMode ? "#fff" : undefined }} />
              <span style={{ color: isDarkMode ? "#fff" : undefined }}>Salir</span>
            </div>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>

      {/* Contenedor principal */}
      <CContainer style={mainContainerStyle}>
        {/* Header */}
        <CHeader className="shadow-sm mb-3" style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
            <img
              src="./src/assets/images/portada-martin-garrix.jpg"
              alt="Admin"
              style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
            />
            <span className="fw-bold">Administrador</span>
          </div>
          <CHeaderNav className="d-flex align-items-center" style={{ margin: "5px 0" }}>
            {/* Sección central */}
          </CHeaderNav>
          <CHeaderNav className="d-flex align-items-center" style={{ margin: "5px 0", position: "relative" }}>
            <CNavItem className="me-3">
              <CButton
                color={isDarkMode ? "dark" : "light"}
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={customButtonStyle}
              >
                <CIcon icon={isDarkMode ? cilSun : cilMoon} />
              </CButton>
            </CNavItem>
            {/* Ícono de notificaciones */}
            <div onClick={toggleNotifications} style={{ cursor: "pointer", position: "relative" }}>
              <CIcon icon={cilBell} size="lg" style={{ color: isDarkMode ? "#fff" : undefined }} />
              <CBadge color="danger" className="ms-1">{notificationsData.length}</CBadge>
              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div style={notificationDropdownStyle}>
                  {notificationsData.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {notificationsData.map((notif, index) => (
                        <li
                          key={index}
                          style={{ padding: "5px 0", borderBottom: "1px solid #ccc", cursor: "pointer" }}
                          onClick={() => removeNotification(index)}
                        >
                          {notif}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0 }}>No hay notificaciones nuevas.</p>
                  )}
                </div>
              )}
            </div>
          </CHeaderNav>
        </CHeader>

        <h2 className="text-center mb-4">Panel de Administración</h2>

        {/* Tarjetas de estadísticas */}
        <CRow className="mb-4">
          <CCol md={4}>
            <CCard style={customCardStyle} color={isDarkMode ? "dark" : "primary"} textColor="white" className="text-center">
              <CCardBody>
                <CCardHeader style={{ ...customHeaderStyle, backgroundColor: isDarkMode ? "#444" : undefined }}>
                  Total de Sensores
                </CCardHeader>
                <h4>{sensorStats.total}</h4>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard style={customCardStyle} color={isDarkMode ? "dark" : "success"} textColor="white" className="text-center">
              <CCardBody>
                <CCardHeader style={{ ...customHeaderStyle, backgroundColor: isDarkMode ? "#444" : undefined }}>
                  Sensores Activos
                </CCardHeader>
                <h4>{sensorStats.active}</h4>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard style={customCardStyle} color={isDarkMode ? "dark" : "warning"} textColor="white" className="text-center">
              <CCardBody>
                <CCardHeader style={{ ...customHeaderStyle, backgroundColor: isDarkMode ? "#444" : undefined }}>
                  Usuarios Registrados (Hoy)
                </CCardHeader>
                <h4>{todayUsersCount}</h4>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Gráficas Paginadas */}
        <ChartPagination isDarkMode={isDarkMode} />

        {/* Sección separada para el botón de exportar con margen superior */}
        <CRow className="mt-4">
          <CCol className="text-center">
            <CButton color="info" onClick={exportToWord} style={{ marginTop: '20px' }}>
              Exportar tablas a Word
            </CButton>
          </CCol>
        </CRow>

        {/* Secciones de Alertas e Incidentes */}
        <CRow className="mt-4">
          {/* Tabla de Alertas Recientes (solo datos de hoy) */}
          <CCol md={6}>
            <CCard style={customCardStyle} color={isDarkMode ? "dark" : undefined} textColor={isDarkMode ? "white" : undefined}>
              <CCardHeader style={{ ...customHeaderStyle, backgroundColor: isDarkMode ? "#444" : undefined }}>
                Alertas Recientes
              </CCardHeader>
              <CCardBody id="alertTable" style={{ backgroundColor: isDarkMode ? "#2d3035" : undefined, color: isDarkMode ? "#fff" : undefined }}>
                <CTable className={isDarkMode ? "table table-dark" : "table table-striped table-hover"}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Ubicación</CTableHeaderCell>
                      <CTableHeaderCell>Descripción</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {recentAlerts.length ? (
                      recentAlerts.map((alert) => (
                        <CTableRow key={alert.id}>
                          <CTableDataCell>{alert.id}</CTableDataCell>
                          <CTableDataCell>{alert.ubicacion}</CTableDataCell>
                          <CTableDataCell>{alert.descripcion}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="danger">{alert.estado}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="4" className="text-center">
                          No hay alertas recientes.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Tabla de Historial de Incidentes con paginación */}
          <CCol md={6}>
            <CCard style={customCardStyle} color={isDarkMode ? "dark" : undefined} textColor={isDarkMode ? "white" : undefined}>
              <CCardHeader style={{ ...customHeaderStyle, backgroundColor: isDarkMode ? "#444" : undefined }}>
                Historial de Incidentes
              </CCardHeader>
              <CCardBody id="incidentTable" style={{ backgroundColor: isDarkMode ? "#2d3035" : undefined, color: isDarkMode ? "#fff" : undefined }}>
                <CTable className={isDarkMode ? "table table-dark" : "table table-striped table-hover"}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Ubicación</CTableHeaderCell>
                      <CTableHeaderCell>Descripción</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentIncidentHistory.length ? (
                      currentIncidentHistory.map((incidente) => (
                        <CTableRow key={incidente.id}>
                          <CTableDataCell>{incidente.id}</CTableDataCell>
                          <CTableDataCell>{incidente.ubicacion}</CTableDataCell>
                          <CTableDataCell>{incidente.descripcion || incidente.tipo}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="danger">{incidente.estado || incidente.time}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="4" className="text-center">
                          No hay historial de incidentes.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                {/* Paginación */}
                <div className="d-flex justify-content-between mt-2">
                  <CButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Anterior
                  </CButton>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <CButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Siguiente
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AdminDashboard;
