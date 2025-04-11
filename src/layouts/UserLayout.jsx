// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import ParticlesBackground from "../components/ParticlesBackground";
import "../styles/UserDashboard.css";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <div className="user-layout-wrapper">
      <ParticlesBackground />
      <Navbar expand="lg" className="metal-navbar">
        <Container>
          <Navbar.Brand>Bienvenido</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="nav-link">Inicio</Nav.Link>
              <Nav.Link className="nav-link">Alertas</Nav.Link>
              <Nav.Link className="nav-link">Guía de Seguridad</Nav.Link>
            </Nav>
            <Nav>
              <Button className="logout-btn" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="user-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
