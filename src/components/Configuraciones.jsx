// src/pages/Configuraciones.jsx
import React, { useState } from "react"
import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import ConfiguracionList from "../components/ConfiguracionList"
import ConfiguracionForm from "../components/ConfiguracionForm"

const Configuraciones = () => {
  const [selectedConfiguracion, setSelectedConfiguracion] = useState(null)
  const [configuraciones, setConfiguraciones] = useState([])
  const navigate = useNavigate()

  // Botón Salir -> redirige a /admin
  const handleSalir = () => {
    navigate("/admin")
  }

  return (
    <>
      {/* Menú Superior */}
      <Navbar bg="dark" variant="dark" className="custom-navbar">
        <Container>
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
      <h2 className="text-center mt-4">Gestión de Configuraciones</h2>

      <Container className="mt-4">
        {/* Formulario */}
        <ConfiguracionForm
          selectedConfiguracion={selectedConfiguracion}
          setSelectedConfiguracion={setSelectedConfiguracion}
          setConfiguraciones={setConfiguraciones}
        />

        {/* Título de la lista */}
        <h3 className="text-center mt-4">Lista de Configuraciones</h3>

        {/* Lista de Configuraciones */}
        <ConfiguracionList
          setSelectedConfiguracion={setSelectedConfiguracion}
          setConfiguraciones={setConfiguraciones}
        />
      </Container>
    </>
  )
}

export default Configuraciones
