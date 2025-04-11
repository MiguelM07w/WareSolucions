import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Table, Button, Form } from "react-bootstrap"; // <-- Importamos Form

const LecturaList = ({ setSelectedLectura, setLecturas }) => {
  const [lecturas, setLocalLecturas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");         // ← Estado para el buscador
  const [currentPage, setCurrentPage] = useState(1);
  const lecturasPerPage = 5;

  // Cargar lecturas
  const fetchLecturas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/lecturas");
      setLocalLecturas(response.data);
      setLecturas(response.data);
    } catch (error) {
      console.error("❌ Error al obtener las lecturas:", error);
    }
  };

  useEffect(() => {
    fetchLecturas();
  }, []);

  // Eliminar lectura
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/lecturas/${id}`);
      fetchLecturas();
      // Ajustar la página si se elimina el último elemento
      if (lecturas.length % lecturasPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("❌ Error al eliminar la lectura:", error);
    }
  };

  // Exportar a Excel
  const handleExport = () => {
    if (lecturas.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(lecturas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lecturas");
    XLSX.writeFile(workbook, "lecturas.xlsx");
  };

  // Importar desde Excel
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet);

      Promise.all(
        importedData.map((lectura) =>
          axios.post("http://localhost:3001/api/lecturas", lectura)
        )
      )
        .then(() => {
          fetchLecturas();
        })
        .catch((error) => console.error("Error al importar lecturas:", error));
    };
    reader.readAsArrayBuffer(file);
  };

  // Filtrado según buscador (ignora mayúsculas)
  const filteredLecturas = lecturas.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      l.sensor_id.toString().toLowerCase().includes(term) ||
      l.tipo.toLowerCase().includes(term) ||
      l.valor.toString().toLowerCase().includes(term)
    );
  });

  // Paginación sobre la lista filtrada
  const totalPages = Math.ceil(filteredLecturas.length / lecturasPerPage);
  const start = (currentPage - 1) * lecturasPerPage;
  const currentLecturas = filteredLecturas.slice(start, start + lecturasPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-4">
      {/* Buscador + Botones de Importar/Exportar */}
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Buscar lecturas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // volver a página 1 al buscar
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

      {/* Tabla de Lecturas */}
      <Table striped bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Sensor ID</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentLecturas.map((lectura, index) => (
            <tr key={lectura.id}>
              <td>{start + index + 1}</td>
              <td>{lectura.sensor_id}</td>
              <td>{lectura.tipo}</td>
              <td>{lectura.valor}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => setSelectedLectura(lectura)}
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(lectura.id)}
                >
                  🗑️ Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {filteredLecturas.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                {lecturas.length === 0
                  ? "No hay lecturas registradas"
                  : "No se encontraron lecturas"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      {filteredLecturas.length > 0 && (
        <div className="pagination-container d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="pagination-indicator">
            {currentPage} / {totalPages || 1}
          </div>
          <Button
            variant="outline-primary"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default LecturaList;
