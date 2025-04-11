import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form, Button } from "react-bootstrap";

const SensorForm = ({ selectedSensor, setSelectedSensor, setSensores }) => {
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("activo");

  useEffect(() => {
    if (selectedSensor) {
      setUbicacion(selectedSensor.ubicacion);
      setDescripcion(selectedSensor.descripcion);
      setEstado(selectedSensor.estado);
    }
  }, [selectedSensor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sensor = { ubicacion, descripcion, estado };

    if (selectedSensor) {
      axios
        .put(`http://localhost:3001/api/sensores/${selectedSensor.id}`, sensor)
        .then((response) => {
          setSensores((prev) =>
            prev.map((s) => (s.id === response.data.id ? response.data : s))
          );
          setSelectedSensor(null);
        })
        .catch((error) =>
          console.error("Error al actualizar sensor:", error)
        );
    } else {
      axios
        .post("http://localhost:3001/api/sensores", sensor)
        .then((response) => {
          setSensores((prev) => [...prev, response.data]);
        })
        .catch((error) =>
          console.error("Error al crear sensor:", error)
        );
    }

    setUbicacion("");
    setDescripcion("");
    setEstado("activo");
  };

  return (
    <Card className="custom-card mx-auto mt-2">
      <Card.Header className="text-center">
        {selectedSensor ? "Editar Sensor" : "Registrar Sensor"}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Form.Control>
          </Form.Group>
          <Button type="submit" className="w-100">
            {selectedSensor ? "Actualizar Sensor" : "Registrar Sensor"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SensorForm;
