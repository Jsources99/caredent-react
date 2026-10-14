import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import EstadoBadge from "../components/EstadoBadge.jsx";
import FilterChips from "../components/FilterChips.jsx";
import { getPatients } from "../services/storage.js";
import { formatDate } from "../utils/format.js";

const FILTROS = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activos" },
  { value: "en-tratamiento", label: "En tratamiento" },
  { value: "pendiente", label: "Pendientes" },
  { value: "inactivo", label: "Inactivos" },
];

export default function ControlesPage() {
  const [pacientes] = useState(() => getPatients());
  const [estado, setEstado] = useState("todos");

  const filtrados = useMemo(
    () => pacientes.filter((p) => estado === "todos" || p.estado === estado),
    [pacientes, estado]
  );

  return (
    <>
      <FilterChips opciones={FILTROS} valor={estado} onChange={setEstado} />

      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-caredent align-middle mb-0">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState>No hay pacientes que coincidan con este filtro.</EmptyState>
                  </td>
                </tr>
              ) : (
                filtrados.map((p) => {
                  const c = p.proximoControl;
                  return (
                    <tr key={p.id}>
                      <td className="cell-name text-nowrap">
                        {p.nombre} {p.apellidos}
                      </td>
                      <td className="text-nowrap">{c ? formatDate(c.fecha) : "Sin control"}</td>
                      <td>{c ? c.motivo : "No registrado"}</td>
                      <td>
                        <EstadoBadge estado={p.estado} />
                      </td>
                      <td className="text-end">
                        <Link className="btn btn-ghost btn-sm text-nowrap" to={`/pacientes/${p.id}`}>
                          Consultar paciente
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
