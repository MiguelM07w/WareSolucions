// src/components/EventoList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Table, Button, Form } from "react-bootstrap"; // <-- Importamos Form

const EventoList = ({ setSelectedEvento, setEventos }) => {
  const [eventos, setLocalEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");           // ← Estado para el buscador
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/eventos");
      setLocalEventos(response.data);
      setEventos(response.data);
    } catch (error) {
      console.error("❌ Error al obtener los eventos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/eventos/${id}`);
      fetchEventos();
      if (eventos.length % eventsPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("❌ Error al eliminar el evento:", error);
    }
  };

  const handleExport = () => {
    if (eventos.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(eventos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Eventos");
    XLSX.writeFile(workbook, "eventos.xlsx");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(ws);

      const requiredFields = ["sensor_id", "tipo", "descripcion", "prioridad"];
      const isValid = importedData.every((evt) =>
        requiredFields.every((f) => f in evt)
      );
      if (!isValid) {
        alert("⚠️ El archivo Excel no tiene el formato correcto.");
        return;
      }

      try {
        await Promise.all(
          importedData.map((evt) =>
            axios.post("http://localhost:3001/api/eventos", evt)
          )
        );
        fetchEventos();
      } catch (error) {
        console.error("❌ Error al importar eventos:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Filtrado según buscador (ignora mayúsculas)
  const filteredEventos = eventos.filter((evt) => {
    const term = searchTerm.toLowerCase();
    return (
      evt.sensor_id.toString().toLowerCase().includes(term) ||
      evt.tipo.toLowerCase().includes(term) ||
      evt.descripcion.toLowerCase().includes(term) ||
      evt.prioridad.toString().toLowerCase().includes(term) ||
      (evt.accion_tomada || "").toLowerCase().includes(term)
    );
  });

  // Paginación sobre la lista filtrada
  const totalPages = Math.ceil(filteredEventos.length / eventsPerPage);
  const start = (currentPage - 1) * eventsPerPage;
  const currentEventos = filteredEventos.slice(start, start + eventsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className="mt-4" style={{ minWidth: "900px" }}>
      {/* Buscador + Botones de Excel */}
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Buscar eventos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // resetear a página 1 al buscar
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

      {/* Tabla de Eventos */}
      <Table striped bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Sensor ID</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Prioridad</th>
            <th>Acción tomada</th>
            <th>Resuelto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentEventos.length > 0 ? (
            currentEventos.map((evento, idx) => (
              <tr key={evento.id}>
                <td>{start + idx + 1}</td>
                <td>{evento.sensor_id}</td>
                <td>{evento.tipo}</td>
                <td>{evento.descripcion}</td>
                <td>{evento.prioridad}</td>
                <td>{evento.accion_tomada}</td>
                <td>{evento.resuelto ? "Sí" : "No"}</td>
                <td className="d-flex justify-content-center gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    className="w-100"
                    onClick={() => setSelectedEvento(evento)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-100"
                    onClick={() => handleDelete(evento.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                {eventos.length === 0
                  ? "No hay eventos registrados"
                  : "No se encontraron eventos"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      {filteredEventos.length > 0 && (
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

export default EventoList;
