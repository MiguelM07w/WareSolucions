import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Librería para exportar/importar Excel
import { Container, Card, Form, Button, Table, Navbar, Nav } from "react-bootstrap";
import "../styles/Usuarios.css";

const UsuarioForm = ({ selectedUser, setSelectedUser, setUsuarios }) => {
  const [nombre, setNombre] = useState("");
  const [app, setApp] = useState("");
  const [apm, setApm] = useState("");
  const [fn, setFn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setNombre(selectedUser.nombre);
      setApp(selectedUser.app);
      setApm(selectedUser.apm);
      setFn(selectedUser.fn);
      setEmail(selectedUser.email);
    }
  }, [selectedUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuario = { nombre, app, apm, fn, email, password };

    if (selectedUser) {
      axios
        .put(`http://localhost:3001/api/usuarios/${selectedUser.id}`, usuario)
        .then((response) => {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === response.data.id ? response.data : u))
          );
          setSelectedUser(null);
        });
    } else {
      axios.post("http://localhost:3001/api/usuarios", usuario).then((response) => {
        setUsuarios((prev) => [...prev, response.data]);
      });
    }

    setNombre("");
    setApp("");
    setApm("");
    setFn("");
    setEmail("");
    setPassword("");
  };

  return (
    <Card className="custom-card mx-auto mt-2">
      <Card.Header className="text-center">
        {selectedUser ? "Editar Usuario" : "Registrar Usuario"}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control
              type="text"
              value={app}
              onChange={(e) => setApp(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control
              type="text"
              value={apm}
              onChange={(e) => setApm(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              value={fn}
              onChange={(e) => setFn(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 mt-2">
            {selectedUser ? "Actualizar" : "Registrar"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const UsuarioList = ({ setSelectedUser, setUsuarios }) => {
  const [usuarios, setUsuariosState] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");        // ← estado para el buscador
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/usuarios");
      setUsuariosState(data);
      if (setUsuarios) setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al obtener los usuarios:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      fetchUsuarios();
    } catch (error) {
      console.error("❌ Error al eliminar el usuario:", error);
    }
  };

  const handleExport = () => {
    if (usuarios.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(usuarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data = new Uint8Array(ev.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(ws);
      const required = ["nombre", "app", "apm", "fn", "email", "password"];
      const valid = imported.every((u) => required.every((f) => f in u));
      if (!valid) {
        alert("⚠️ El archivo Excel no tiene el formato correcto.");
        return;
      }
      try {
        await Promise.all(
          imported.map((usuario) =>
            axios.post("http://localhost:3001/api/usuarios", {
              ...usuario,
              password: usuario.password || "123456",
            })
          )
        );
        fetchUsuarios();
      } catch (err) {
        console.error("❌ Error al importar usuarios:", err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Filtrado según buscador (ignora mayúsculas)
  const filtered = usuarios.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(term) ||
      u.app.toLowerCase().includes(term) ||
      u.apm.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  // Paginación sobre la lista filtrada
  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const currentUsers = filtered.slice(start, start + usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Container className="mt-2">
      {/* Contenedor flex: buscador a la izquierda, botones a la derecha */}
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: "250px" }}
          className="me-2"
        />
        <div className="ms-auto">
          <Button variant="success" className="me-2" onClick={handleExport}>
            📥 Exportar a Excel
          </Button>
          <label className="btn btn-primary mb-0">
            📤 Importar desde Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              className="d-none"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((u, i) => (
              <tr key={u.id}>
                <td>{start + i + 1}</td>
                <td>{u.nombre}</td>
                <td>{u.app}</td>
                <td>{u.apm}</td>
                <td>{u.email}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => setSelectedUser(u)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                {usuarios.length === 0
                  ? "No hay usuarios registrados"
                  : "No se encontraron usuarios"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="pagination-container d-flex justify-content-between align-items-center">
        <Button
          variant="outline-primary"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="pagination-indicator">
          {currentPage} / {totalPages || 1}
        </div>
        <Button
          variant="outline-primary"
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

const Usuarios = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  return (
    <>
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

      <Container fluid className="mt-2">
        <UsuarioForm
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setUsuarios={setUsuarios}
        />
        <UsuarioList
          setSelectedUser={setSelectedUser}
          setUsuarios={setUsuarios}
        />
      </Container>
    </>
  );
};

export default Usuarios;
