import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Verifica que la ruta sea correcta
import "../styles/Register.css"; 
import "../styles/RegisterLayout.css";
import RegisterLayout from "../layouts/RegisterLayout"; // Asegúrate de que exista en esa ruta

const Register = ({ setUserLoggedIn }) => {
  const [userData, setUserData] = useState({
    nombre: "",
    app: "",
    apm: "",
    fn: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/usuarios", userData)
      .then((response) => {
        console.log("Respuesta del servidor:", response);
        if (response.status === 201) {
          alert(response.data.message);
          navigate("/login");
        } else {
          alert("Error inesperado al registrar usuario");
        }
      })
      .catch((error) => {
        console.error("Error al registrar el usuario:", error.response?.data || error);
        alert(error.response?.data?.error || "Error al registrar el usuario");
      });
  };

  return (
    <RegisterLayout>
      <div className="register-card">
        <h2 className="text-center mb-4">Registrar Usuario</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={userData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido Paterno</label>
              <input
                type="text"
                className="form-control"
                name="app"
                value={userData.app}
                onChange={handleChange}
                placeholder="Apellido Paterno"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Apellido Materno</label>
              <input
                type="text"
                className="form-control"
                name="apm"
                value={userData.apm}
                onChange={handleChange}
                placeholder="Apellido Materno"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                name="fn"
                value={userData.fn}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-register full-width">
            Registrarse
          </button>
        </form>
        <p className="mt-3 text-center">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </RegisterLayout>
  );
};

export default Register;
