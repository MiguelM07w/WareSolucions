import React, { useEffect, useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"
import { Button, Table, Form } from "react-bootstrap"

const ConfiguracionList = ({ setSelectedConfiguracion, setConfiguraciones }) => {
  const [configuraciones, setConfiguracionesState] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const configsPerPage = 5

  useEffect(() => {
    fetchConfiguraciones()
  }, [])

  const fetchConfiguraciones = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/configuracion")
      setConfiguracionesState(response.data)
      setConfiguraciones(response.data)
    } catch (error) {
      console.error("❌ Error al obtener configuraciones:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/configuracion/${id}`)
      fetchConfiguraciones()
      if (configuraciones.length % configsPerPage === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error("❌ Error al eliminar configuración:", error)
    }
  }

  const handleExport = () => {
    if (configuraciones.length === 0) {
      alert("No hay datos para exportar.")
      return
    }
    const worksheet = XLSX.utils.json_to_sheet(configuraciones)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Configuraciones")
    XLSX.writeFile(workbook, "configuraciones.xlsx")
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const importedData = XLSX.utils.sheet_to_json(worksheet)

      const requiredFields = ["clave", "valor"]
      const isValid = importedData.every((config) =>
        requiredFields.every((field) => field in config)
      )

      if (!isValid) {
        alert("⚠️ El archivo Excel no tiene el formato correcto.")
        return
      }

      try {
        await Promise.all(
          importedData.map((config) =>
            axios.post("http://localhost:3001/api/configuracion", config)
          )
        )
        fetchConfiguraciones()
      } catch (error) {
        console.error("❌ Error al importar configuraciones:", error)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Filtro de búsqueda
  const filteredConfigs = configuraciones.filter(
    (config) =>
      config.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.valor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredConfigs.length / configsPerPage)
  const currentConfigs = filteredConfigs.slice(
    (currentPage - 1) * configsPerPage,
    currentPage * configsPerPage
  )

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  return (
    <div className="mt-4" style={{ minWidth: "700px" }}>
      {/* Buscador */}
      <Form.Group controlId="search" className="mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Buscar por clave o valor..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />
      </Form.Group>

      {/* Botones de Exportar/Importar */}
      <div className="d-flex justify-content-center mb-3">
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

      {/* Tabla */}
      <Table striped bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Clave</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentConfigs.length > 0 ? (
            currentConfigs.map((config, index) => (
              <tr key={config.id}>
                <td>{(currentPage - 1) * configsPerPage + index + 1}</td>
                <td>{config.clave}</td>
                <td>{config.valor}</td>
                <td className="d-flex justify-content-center gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => setSelectedConfiguracion(config)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No hay configuraciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginación */}
      {filteredConfigs.length > 0 && (
        <div className="pagination-container d-flex justify-content-between align-items-center">
          <Button variant="outline-primary" onClick={handlePrev} disabled={currentPage === 1}>
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
  )
}

export default ConfiguracionList
