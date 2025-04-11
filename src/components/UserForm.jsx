import React, { useState, useEffect } from "react";
import axios from "axios";

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
      // Actualizar el usuario
      axios
        .put(`http://localhost:3001/api/usuarios/${selectedUser.id}`, usuario)
        .then((response) => {
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) =>
              u.id === response.data.id ? response.data : u
            )
          );
          setSelectedUser(null);
        })
        .catch((error) => {
          console.error("Error al actualizar el usuario:", error);
        });
    } else {
      // Crear un nuevo usuario
      axios
        .post("http://localhost:3001/api/usuarios", usuario)
        .then((response) => {
          setUsuarios((prevUsuarios) => [...prevUsuarios, response.data]);
        })
        .catch((error) => {
          console.error("Error al crear el usuario:", error);
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: "30rem" }}>
        <div className="card-header">
          <h4>{selectedUser ? "Editar Usuario" : "Registrar Usuario"}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="app" className="form-label">
                Apellido Paterno
              </label>
              <input
                type="text"
                id="app"
                name="app"
                className="form-control"
                value={app}
                onChange={(e) => setApp(e.target.value)}
                placeholder="Apellido Paterno"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apm" className="form-label">
                Apellido Materno
              </label>
              <input
                type="text"
                id="apm"
                name="apm"
                className="form-control"
                value={apm}
                onChange={(e) => setApm(e.target.value)}
                placeholder="Apellido Materno"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fn" className="form-label">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fn"
                name="fn"
                className="form-control"
                value={fn}
                onChange={(e) => setFn(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {selectedUser ? "Actualizar Usuario" : "Registrar Usuario"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;
