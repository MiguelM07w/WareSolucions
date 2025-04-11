import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '../styles/Login.css';
import "../styles/LoginLayout.css";

const Login = ({ setUserLoggedIn, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:3001/api/usuarios/login", { email, password })
      .then((response) => {
        const { role } = response.data;
        alert("Login exitoso!");
        setUserLoggedIn(true);
        setUserRole(role);
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userRole", role);
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      })
      .catch((error) => {
        console.error("Error de autenticación", error.response || error.message);
        if (
          error.response &&
          error.response.data.error === "Cuenta bloqueada. Intenta nuevamente más tarde." &&
          error.response.data.time_remaining
        ) {
          const remaining = error.response.data.time_remaining;
          setError(`Cuenta bloqueada. Intente nuevamente en ${remaining} segundos.`);
          setTimeRemaining(remaining);
        } else {
          setError("Credenciales incorrectas. Intenta de nuevo.");
          setEmail("");
          setPassword("");
        }
      });
  };

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const intervalId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setError("");
            setEmail("");
            setPassword("");
            alert("Intente de nuevo");
            return 0;
          }
          setError(`Cuenta bloqueada. Intente nuevamente en ${prev - 1} segundos.`);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeRemaining]);

  return (
    <div className="login-container">
      <div className="login-card card p-4 shadow">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              disabled={timeRemaining > 0}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              disabled={timeRemaining > 0}
            />
          </div>
          <button type="submit" className="btn btn-secondary w-100" disabled={timeRemaining > 0}>
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-3 text-center">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;