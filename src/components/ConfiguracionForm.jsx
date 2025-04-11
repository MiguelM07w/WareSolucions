// src/components/ConfiguracionForm.jsx
import React, { useState, useEffect } from "react"
import axios from "axios"

const ConfiguracionForm = ({
  selectedConfiguracion,
  setSelectedConfiguracion,
  setConfiguraciones,
}) => {
  const [clave, setClave] = useState("")
  const [valor, setValor] = useState("")

  useEffect(() => {
    if (selectedConfiguracion) {
      setClave(selectedConfiguracion.clave)
      setValor(selectedConfiguracion.valor)
    } else {
      // Limpiar el formulario si no hay configuración seleccionada
      setClave("")
      setValor("")
    }
  }, [selectedConfiguracion])

  const handleSubmit = (e) => {
    e.preventDefault()
    const configData = { clave, valor }

    if (selectedConfiguracion) {
      // Actualizar configuración existente
      axios
        .put(`http://localhost:3001/api/configuracion/${selectedConfiguracion.id}`, configData)
        .then((response) => {
          setConfiguraciones((prev) =>
            prev.map((c) => (c.id === response.data.id ? response.data : c))
          )
          setSelectedConfiguracion(null)
        })
        .catch((error) => console.error("Error al actualizar configuración:", error))
    } else {
      // Crear nueva configuración
      axios
        .post("http://localhost:3001/api/configuracion", configData)
        .then((response) => {
          setConfiguraciones((prev) => [...prev, response.data])
        })
        .catch((error) => console.error("Error al crear configuración:", error))
    }

    setClave("")
    setValor("")
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        {selectedConfiguracion ? "Editar Configuración" : "Registrar Configuración"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="clave" className="form-label">
            Clave
          </label>
          <input
            type="text"
            id="clave"
            className="form-control"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">
            Valor
          </label>
          <input
            type="text"
            id="valor"
            className="form-control"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {selectedConfiguracion ? "Actualizar Configuración" : "Registrar Configuración"}
        </button>
      </form>
    </div>
  )
}

export default ConfiguracionForm
