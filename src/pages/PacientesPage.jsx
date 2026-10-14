import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import EstadoBadge from "../components/EstadoBadge.jsx";
import FilterChips from "../components/FilterChips.jsx";
import Icon from "../components/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { deletePatient, getPatients } from "../services/storage.js";
import { formatDate } from "../utils/format.js";

const FILTROS = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activo" },
  { value: "en-tratamiento", label: "En tratamiento" },
  { value: "pendiente", label: "Pendiente" },
  { value: "inactivo", label: "Inactivo" },
];

export default function PacientesPage() {
  const { session } = useAuth();
  const showToast = useToast();
  const [pacientes, setPacientes] = useState(() => getPatients());
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState("todos");

  const esAdmin = session.rol === "administrador";

  // Se recalcula solo cuando cambian la lista, el texto o el filtro.
  const filtrados = useMemo(() => {
    const t = texto.trim().toLowerCase();
    return pacientes.filter((p) => {
      const coincideTexto =
        !t || `${p.nombre} ${p.apellidos}`.toLowerCase().includes(t) || p.rut.toLowerCase().includes(t);
      return coincideTexto && (estado === "todos" || p.estado === estado);
    });
  }, [pacientes, texto, estado]);

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar este paciente? Esta acción se realiza solo en la demostración frontend.")) return;
    deletePatient(id);
    setPacientes(getPatients());
    showToast("Paciente eliminado correctamente.");
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-3">
        <div className="input-group search-group">
          <span className="input-group-text">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o RUT…"
            aria-label="Buscar paciente"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        {!esAdmin && (
          <Link className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2" to="/pacientes/nuevo">
            <Icon name="plus" size={16} />
            Registrar paciente
          </Link>
        )}
      </div>

      <FilterChips opciones={FILTROS} valor={estado} onChange={setEstado} />

      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-caredent align-middle mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Última atención</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState>No se encontraron pacientes con ese criterio de búsqueda.</EmptyState>
                  </td>
                </tr>
              ) : (
                filtrados.map((p) => (
                  <tr key={p.id}>
                    <td className="cell-name text-nowrap">
                      {p.nombre} {p.apellidos}
                    </td>
                    <td className="text-nowrap">{p.rut}</td>
                    <td className="text-nowrap">{formatDate(p.ultimaAtencion)}</td>
                    <td>
                      <EstadoBadge estado={p.estado} />
                    </td>
                    <td>
                      <div className="d-flex flex-wrap justify-content-end gap-2">
                        <Link className="btn btn-ghost btn-sm" to={`/pacientes/${p.id}`}>
                          Ver paciente
                        </Link>
                        {!esAdmin && (
                          <>
                            <Link className="btn btn-ghost btn-sm" to={`/pacientes/${p.id}/editar`}>
                              Modificar
                            </Link>
                            <button type="button" className="btn btn-danger-soft btn-sm" onClick={() => eliminar(p.id)}>
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
