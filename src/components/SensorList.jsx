import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Table, Button, Form } from "react-bootstrap";

const SensorList = ({ setSelectedSensor }) => {
  const [sensores, setSensores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para búsqueda
  const sensorsPerPage = 5;

  useEffect(() => {
    fetchSensores();
  }, []);

  const fetchSensores = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/sensores");
      setSensores(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los sensores:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/sensores/${id}`);
      fetchSensores();
    } catch (error) {
      console.error("❌ Error al eliminar el sensor:", error);
    }
  };

  const handleExport = () => {
    if (sensores.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(sensores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensores");
    XLSX.writeFile(workbook, "sensores.xlsx");
  };

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

      try {
        await Promise.all(
          importedData.map((sensor) =>
            axios.post("http://localhost:3001/api/sensores", sensor)
          )
        );
        fetchSensores();
      } catch (error) {
        console.error("❌ Error al importar sensores:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Búsqueda filtrada
  const filteredSensores = sensores.filter((sensor) =>
    sensor.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sensor.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSensores.length / sensorsPerPage);

  const currentSensors = filteredSensores.slice(
    (currentPage - 1) * sensorsPerPage,
    currentPage * sensorsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-2 container">
      {/* Buscador */}
      <Form.Control
        type="text"
        placeholder="🔍 Buscar por ubicación, descripción o estado"
        className="mb-3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reiniciar a página 1 al buscar
        }}
      />

      {/* Botones de Excel */}
      <div className="d-flex justify-content-end mb-3">
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

      {/* Tabla de Sensores */}
      <Table striped bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentSensors.length > 0 ? (
            currentSensors.map((sensor, index) => (
              <tr key={sensor.id}>
                <td>{(currentPage - 1) * sensorsPerPage + index + 1}</td>
                <td>{sensor.ubicacion}</td>
                <td>{sensor.descripcion}</td>
                <td>{sensor.estado}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => setSelectedSensor(sensor)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(sensor.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No hay sensores registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      {filteredSensores.length > 0 && (
        <div className="pagination-container d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="pagination-indicator">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline-primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default SensorList;
