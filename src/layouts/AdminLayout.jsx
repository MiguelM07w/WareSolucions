// layouts/AdminLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CNavItem,
  CContainer,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { 
  cilSpeedometer, 
  cilUser, 
  cilFire, 
  cilSettings, 
  cilExitToApp, 
  cilBell,    // Para Eventos
  cilList     // Para Lecturas
} from "@coreui/icons";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <CSidebar visible={true}>
        <CSidebarNav>
          <CNavTitle>Administrador</CNavTitle>
          <CNavItem component={NavLink} to="/admin" end>
            <CIcon icon={cilSpeedometer} className="me-2" />
            Dashboard
          </CNavItem>
          <CNavItem component={NavLink} to="/admin/usuarios">
            <CIcon icon={cilUser} className="me-2" />
            Usuarios
          </CNavItem>
          <CNavItem component={NavLink} to="/admin/sensores">
            <CIcon icon={cilFire} className="me-2" />
            Sensores
          </CNavItem>
          <CNavItem component={NavLink} to="/admin/configuracion">
            <CIcon icon={cilSettings} className="me-2" />
            Configuración
          </CNavItem>
          <CNavItem component={NavLink} to="/admin/incidentes">
            <CIcon icon={cilBell} className="me-2" />
            Incidentes
          </CNavItem>
          <CNavItem component={NavLink} to="/admin/lecturas">
            <CIcon icon={cilList} className="me-2" />
            Lecturas
          </CNavItem>
          <CNavItem onClick={handleLogout} style={{ cursor: "pointer" }}>
            <CIcon icon={cilExitToApp} className="me-2" />
            Salir
          </CNavItem>
        </CSidebarNav>
      </CSidebar>

      {/* Contenido principal */}
      <CContainer className="mt-4">
        <Outlet />
      </CContainer>
    </div>
  );
};

export default AdminLayout;
