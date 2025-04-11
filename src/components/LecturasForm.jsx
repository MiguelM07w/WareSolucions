import React, { useState, useEffect } from "react";
import axios from "axios";

const LecturaForm = ({ selectedLectura, setSelectedLectura, setLecturas, sensores = [] }) => {
  const [sensorId, setSensorId] = useState("");
  const [tipo, setTipo] = useState("humo");
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (selectedLectura) {
      setSensorId(selectedLectura.sensor_id);
      setTipo(selectedLectura.tipo);
      setValor(selectedLectura.valor);
    }
  }, [selectedLectura]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!sensorId) {
      alert("Debe seleccionar un sensor.");
      return;
    }

    const lectura = { 
      sensor_id: parseInt(sensorId, 10), 
      tipo, 
      valor: parseFloat(valor)
    };

    if (selectedLectura) {
      // Editar Lectura
      axios
        .put(`http://localhost:3001/api/lecturas/${selectedLectura.id}`, lectura)
        .then((response) => {
          setLecturas((prev) =>
            prev.map((l) => (l.id === response.data.id ? response.data : l))
          );
          setSelectedLectura(null);
        })
        .catch((error) => console.error("Error al actualizar la lectura:", error));
    } else {
      // Crear Lectura
      axios
        .post("http://localhost:3001/api/lecturas", lectura)
        .then((response) => {
          setLecturas((prev) => [...prev, response.data]);
        })
        .catch((error) => console.error("Error al crear la lectura:", error));
    }

    setSensorId("");
    setTipo("humo");
    setValor("");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        {selectedLectura ? "Editar Lectura" : "Registrar Lectura"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="sensor_id" className="form-label">
            Sensor
          </label>
          <select
            id="sensor_id"
            className="form-control"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
            required
          >
            <option value="">Seleccione un sensor</option>
            {sensores && sensores.length > 0 ? (
              sensores.map((sensor) => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.ubicacion}
                </option>
              ))
            ) : (
              <option disabled>No hay sensores disponibles</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="tipo" className="form-label">
            Tipo
          </label>
          <select
            id="tipo"
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="humo">Humo</option>
            <option value="temperatura">Temperatura</option>
            <option value="gas">Gas</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            id="valor"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {selectedLectura ? "Actualizar Lectura" : "Registrar Lectura"}
        </button>
      </form>
    </div>
  );
};

export default LecturaForm;
