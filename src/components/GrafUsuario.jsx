// src/pages/GrafUsuario.jsx
import React, { useState, useEffect } from "react";
import { CContainer, CCard, CCardHeader, CCardBody } from "@coreui/react";
import UsuarioChart from "../components/UsuarioChart";
import axios from "axios";

const GrafUsuario = () => {
  const [todayUsersCount, setTodayUsersCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/usuarios")
      .then((response) => {
        const allUsers = response.data;
        const today = new Date().toDateString();
        const usersToday = allUsers.filter((user) => {
          const userDate = new Date(user.created_at).toDateString();
          return userDate === today;
        });
        setTodayUsersCount(usersToday.length);
      })
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  return (
    <CContainer className="mt-4">
      <CCard className="mb-4">
        <CCardHeader>Monitoreo de Usuarios</CCardHeader>
        <CCardBody>
          <p>Usuarios registrados hoy: {todayUsersCount}</p>
          <UsuarioChart />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default GrafUsuario;
