// src/App.jsx
import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import '@coreui/coreui/dist/css/coreui.min.css'
import '@coreui/icons/css/all.min.css'
import UserDashboard from "./components/UserDashboard";
import Sensores from "./components/Sensores";
import Lecturas from "./components/Lecturas";
import Eventos from "./components/Eventos";
import Configuracion from "./components/Configuraciones";
import Usuarios from "./components/Usuarios";
import GrafConfiguraciones from "./components/GrafConfiguraciones";
import GrafLecturas from "./components/GrafLecturas";
import GrafEventos from "./components/GrafEventos";
import GrafUsuarios from "./components/GrafUsuario";
import GrafSensores from "./components/GrafSensores";
import LoginLayout from "./layouts/LoginLayout";
import RegisterLayout from "./layouts/RegisterLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; // Importa el nuevo UserLayout
import Home from "./components/index"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Index from "./components";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(() => localStorage.getItem("userLoggedIn") === "true");
  const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "");

  useEffect(() => {
    localStorage.setItem("userLoggedIn", userLoggedIn);
    localStorage.setItem("userRole", userRole);
  }, [userLoggedIn, userRole]);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas: login y register usan un layout distinto */}
        <Route path="/login" element={
          <LoginLayout>
            <Login setUserLoggedIn={setUserLoggedIn} setUserRole={setUserRole} />
          </LoginLayout>
        } />
        <Route path="/register" element={
          <RegisterLayout>
            <Register setUserLoggedIn={setUserLoggedIn} />
          </RegisterLayout>
        } />

        {/* Ruta para la página de inicio */}
        <Route path="/index" element={<Index />} />

        {/* Rutas protegidas para el administrador */}
        <Route path="/admin" element={userLoggedIn && userRole === "admin" ? 
          <div className="container mt-4">
            <AdminDashboard />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/sensores" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <Sensores />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/lecturas" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <Lecturas />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/incidentes" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <Eventos />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/configuracion" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <Configuracion />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/usuarios" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <Usuarios />
          </div>
          : <Navigate to="/login" replace />} />

        {/* Rutas para las gráficas individuales */}
        <Route path="/admin/grafconfiguraciones" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <GrafConfiguraciones />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/graflecturas" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <GrafLecturas />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/grafeventos" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <GrafEventos />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/grafusuarios" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <GrafUsuarios />
          </div>
          : <Navigate to="/login" replace />} />
        <Route path="/admin/grafsensores" element={userLoggedIn && userRole === "admin" ?
          <div className="container mt-4">
            <GrafSensores />
          </div>
          : <Navigate to="/login" replace />} />

        {/* Rutas protegidas para usuarios normales */}
        <Route path="/user/*" element={userLoggedIn && userRole === "user" ? <UserLayout /> : <Navigate to="/login" replace />} >
          <Route index element={<UserDashboard />} />
        </Route>

        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
};

export default App;
