import { useMemo } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import EstadoBadge from "../components/EstadoBadge.jsx";
import Icon from "../components/Icon.jsx";
import KpiCard from "../components/KpiCard.jsx";
import { getPatients } from "../services/storage.js";
import { formatDate } from "../utils/format.js";

const ACCESOS = [
  { to: "/pacientes", icon: "user", title: "Ver pacientes", sub: "Listado completo y búsqueda" },
  { to: "/pacientes/nuevo", icon: "plus", title: "Registrar paciente", sub: "Agregar un nuevo ingreso" },
  { to: "/controles", icon: "calendar", title: "Controles pendientes", sub: "Agenda de seguimiento" },
];

export default function DashboardPage() {
  // Se calculan una sola vez al abrir la página.
  const { pacientes, conControl, enCurso, proximos } = useMemo(() => {
    const lista = getPatients();
    const con = lista.filter((p) => p.proximoControl);
    return {
      pacientes: lista,
      conControl: con,
      enCurso: lista.flatMap((p) => p.tratamientos).filter((t) => t.estado === "en-curso"),
      proximos: con.slice().sort((a, b) => a.proximoControl.fecha.localeCompare(b.proximoControl.fecha)),
    };
  }, []);

  const primero = proximos[0];

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard label="Pacientes registrados" value={pacientes.length} sub="En la base de la clínica" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard label="Controles pendientes" value={conControl.length} sub="Requieren agendar o confirmar" warn />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard label="Tratamientos en curso" value={enCurso.length} sub="Activos actualmente" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <KpiCard
            label="Próximo control"
            value={primero ? formatDate(primero.proximoControl.fecha) : "Sin controles"}
            sub={primero ? `${primero.nombre} ${primero.apellidos}` : "No hay controles agendados"}
            small
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="section-title">
            Próximos controles
            <Link className="link" to="/controles">
              Ver todos
            </Link>
          </div>
          <div className="card table-card">
            <div className="table-responsive">
              <table className="table table-caredent align-middle mb-0">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Fecha</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proximos.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <EmptyState>No hay controles próximos registrados.</EmptyState>
                      </td>
                    </tr>
                  ) : (
                    proximos.slice(0, 5).map((p) => (
                      <tr key={p.id}>
                        <td className="cell-name">
                          <Link to={`/pacientes/${p.id}`}>
                            {p.nombre} {p.apellidos}
                          </Link>
                        </td>
                        <td>{formatDate(p.proximoControl.fecha)}</td>
                        <td>{p.proximoControl.motivo}</td>
                        <td>
                          <EstadoBadge estado={p.proximoControl.estado} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="section-title">Accesos rápidos</div>
          <div className="d-flex flex-column gap-2">
            {ACCESOS.map((a) => (
              <Link key={a.to} to={a.to} className="quick-link">
                <div className="quick-link-icon">
                  <Icon name={a.icon} />
                </div>
                <div>
                  <div className="quick-link-title">{a.title}</div>
                  <div className="quick-link-sub">{a.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
