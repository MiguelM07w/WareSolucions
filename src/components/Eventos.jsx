// src/pages/Eventos.jsx
import React, { useState, useEffect } from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventoList from "../components/EventosList";
import EventoForm from "../components/EventosForm";

const Eventos = () => {
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [sensores, setSensores] = useState([]);

  const navigate = useNavigate();

  // Obtener eventos y sensores de la API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/eventos")
      .then((response) => setEventos(response.data))
      .catch((error) => console.error("Error al obtener eventos:", error));

    axios
      .get("http://localhost:3001/api/sensores")
      .then((response) => setSensores(response.data))
      .catch((error) => console.error("Error al obtener sensores:", error));
  }, []);

  // Botón Salir
  const handleSalir = () => {
    navigate("/admin");
  };

  return (
    <>
      {/* Menú (Navbar) */}
      <Navbar bg="dark" variant="dark" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
                     <Nav.Link href="/admin">Área de Administración</Nav.Link>
                     <Nav.Link href="/admin/usuarios">Usuarios</Nav.Link>
                     <Nav.Link href="/admin/sensores">Sensores</Nav.Link>
                     <Nav.Link href="/admin/lecturas">Lecturas</Nav.Link>
                     <Nav.Link href="/admin/incidentes">Incidentes</Nav.Link>
                     <Nav.Link href="/admin/configuracion">Configuración</Nav.Link>
                   </Nav>
        </Container>
      </Navbar>

      {/* Título principal */}
      <h2 className="text-center mt-4">Gestión de Eventos</h2>

      <Container className="mt-4">
        {/* Formulario para Registrar/Editar evento */}
        <EventoForm
          selectedEvento={selectedEvento}
          setSelectedEvento={setSelectedEvento}
          setEventos={setEventos}
          sensores={sensores}
        />

        {/* Título de la lista */}
        <h3 className="text-center mt-4">Lista de Eventos</h3>

        {/* Lista de Eventos */}
        <EventoList setSelectedEvento={setSelectedEvento} setEventos={setEventos} />
      </Container>
    </>
  );
};

export default Eventos;
