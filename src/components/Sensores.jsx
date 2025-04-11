import React, { useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import SensorForm from "./SensorForm";
import SensorList from "./SensorList";

const Sensores = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  return (
    <>
      {/* Menú / Navbar */}
      <Navbar className="custom-navbar">
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

      {/* Contenido principal */}
      <Container fluid className="mt-2">
        {/* Título y formulario */}
        <h2 className="text-center mb-3">
          {selectedSensor ? "Editar Sensor" : "Registrar Sensor"}
        </h2>
        <SensorForm
          selectedSensor={selectedSensor}
          setSelectedSensor={setSelectedSensor}
        />

        {/* Título y lista de sensores */}
        <h2 className="text-center my-4">Lista de Sensores</h2>
        <SensorList setSelectedSensor={setSelectedSensor} />
      </Container>
    </>
  );
};

export default Sensores;
