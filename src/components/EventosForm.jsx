// src/components/EventoForm.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"

const EventoForm = ({ selectedEvento, setSelectedEvento, setEventos, sensores }) => {
  const [sensorId, setSensorId] = useState("")
  const [tipo, setTipo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState("baja")
  const [accionTomada, setAccionTomada] = useState("")
  const [resuelto, setResuelto] = useState(false)

  useEffect(() => {
    if (selectedEvento) {
      setSensorId(selectedEvento.sensor_id)
      setTipo(selectedEvento.tipo)
      setDescripcion(selectedEvento.descripcion)
      setPrioridad(selectedEvento.prioridad)
      setAccionTomada(selectedEvento.accion_tomada)
      setResuelto(selectedEvento.resuelto)
    } else {
      // Limpiar el formulario si no hay evento seleccionado
      setSensorId("")
      setTipo("")
      setDescripcion("")
      setPrioridad("baja")
      setAccionTomada("")
      setResuelto(false)
    }
  }, [selectedEvento])

  const handleSubmit = (e) => {
    e.preventDefault()
    const evento = {
      sensor_id: sensorId,
      tipo,
      descripcion,
      prioridad,
      accion_tomada: accionTomada,
      resuelto,
    }

    if (selectedEvento) {
      // Actualizar evento existente
      axios
        .put(`http://localhost:3001/api/eventos/${selectedEvento.id}`, evento)
        .then((response) => {
          setEventos((prev) =>
            prev.map((ev) => (ev.id === response.data.id ? response.data : ev))
          )
          setSelectedEvento(null)
        })
        .catch((error) => console.error("Error al actualizar el evento:", error))
    } else {
      // Crear nuevo evento
      axios
        .post("http://localhost:3001/api/eventos", evento)
        .then((response) => {
          setEventos((prev) => [...prev, response.data])
        })
        .catch((error) => console.error("Error al crear el evento:", error))
    }

    // Limpiar campos
    setSensorId("")
    setTipo("")
    setDescripcion("")
    setPrioridad("baja")
    setAccionTomada("")
    setResuelto(false)
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        {selectedEvento ? "Editar Evento" : "Registrar Evento"}
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
            {sensores.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.ubicacion}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="tipo" className="form-label">
            Tipo
          </label>
          <input
            type="text"
            id="tipo"
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="prioridad" className="form-label">
            Prioridad
          </label>
          <select
            id="prioridad"
            className="form-control"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="accion_tomada" className="form-label">
            Acción tomada
          </label>
          <input
            type="text"
            id="accion_tomada"
            className="form-control"
            value={accionTomada}
            onChange={(e) => setAccionTomada(e.target.value)}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="resuelto"
            className="form-check-input"
            checked={resuelto}
            onChange={(e) => setResuelto(e.target.checked)}
          />
          <label htmlFor="resuelto" className="form-check-label">
            Resuelto
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {selectedEvento ? "Actualizar Evento" : "Registrar Evento"}
        </button>
      </form>
    </div>
  )
}

export default EventoForm
