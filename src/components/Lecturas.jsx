import React, { useState } from "react"
import { Container, Navbar, Nav, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import LecturaForm from "../components/LecturasForm"
import LecturaList from "../components/LecturasList"

const Lecturas = () => {
  const [selectedLectura, setSelectedLectura] = useState(null)
  const [lecturas, setLecturas] = useState([])

  // Sensores de ejemplo
  const [sensores] = useState([
    { id: 1, ubicacion: "Sensor Planta Baja" },
    { id: 2, ubicacion: "Sensor Segundo Piso" },
    { id: 3, ubicacion: "Sensor Almacén" },
  ])

  const navigate = useNavigate()

  // Botón de salir -> redirige al área de administración
  const handleSalir = () => {
    navigate("/admin")
  }

  return (
    <>
      {/* Menú Superior */}
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
      <h2 className="text-center mt-4">Gestión de Lecturas</h2>

      <Container className="mt-4">
        {/* Formulario */}
        <LecturaForm
          selectedLectura={selectedLectura}
          setSelectedLectura={setSelectedLectura}
          setLecturas={setLecturas}
          sensores={sensores} // Pasamos sensores de ejemplo
        />

        {/* Título de la lista */}
        <h3 className="text-center mt-4">Lista de Lecturas</h3>

        {/* Lista de Lecturas */}
        <LecturaList
          setSelectedLectura={setSelectedLectura}
          setLecturas={setLecturas}
        />
      </Container>
    </>
  )
}

export default Lecturas
