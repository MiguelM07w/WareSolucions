import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // 📌 Librería para exportar/importar Excel

const UsuarioList = ({ setSelectedUser }) => {
  const [usuarios, setUsuariosState] = useState([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 📌 Obtener usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/usuarios");
      setUsuariosState(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los usuarios:", error);
    }
  };

  // 📌 Eliminar usuario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      fetchUsuarios(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("❌ Error al eliminar el usuario:", error);
    }
  };

  // 📌 Función para exportar a Excel
  const handleExport = () => {
    if (usuarios.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(usuarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "usuarios.xlsx");
  };

  // 📌 Función para importar desde Excel
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet);

      const requiredFields = ["nombre", "app", "apm", "fn", "email", "password"];
      const isValid = importedData.every((user) =>
        requiredFields.every((field) => field in user)
      );

      if (!isValid) {
        alert("⚠️ El archivo Excel no tiene el formato correcto.");
        return;
      }

      try {
        // Enviar usuarios a la API con una contraseña por defecto si no tienen
        await Promise.all(
          importedData.map((usuario) =>
            axios.post("http://localhost:3001/api/usuarios", {
              ...usuario,
              password: usuario.password ? usuario.password : "123456", // 👈 Asignar por defecto
            })
          )
        );
        fetchUsuarios(); // Refrescar la lista después de importar
      } catch (error) {
        console.error("❌ Error al importar usuarios:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>
      
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success me-2" onClick={handleExport}>
          📥 Exportar a Excel
        </button>
        <label className="btn btn-primary">
          📤 Importar desde Excel
          <input
            type="file"
            accept=".xlsx, .xls"
            className="d-none"
            onChange={handleImport}
          />
        </label>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Fecha Nacimiento</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario, index) => (
                <tr key={usuario.id}>
                  <td>{index + 1}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.app}</td>
                  <td>{usuario.apm}</td>
                  <td>{usuario.fn}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => setSelectedUser(usuario)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(usuario.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioList;
