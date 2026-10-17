import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import { IconCalendar, IconPerson, IconPlus } from "../components/Icons";
import Layout from "../components/Layout";
import { getPatients } from "../data/store";
import { estadoControl, formatDate } from "../utils";

export default function Dashboard() {
  const pacientes = getPatients();
  const conControl = pacientes.filter((p) => p.proximoControl);
  const enCurso = pacientes.flatMap((p) => p.tratamientos).filter((t) => t.estado === "en-curso");
  const ordenados = [...conControl].sort((a, b) => a.proximoControl.fecha.localeCompare(b.proximoControl.fecha));
  const primero = ordenados[0];

  return (
    <Layout eyebrow="Panel principal" title="Bienvenido/a de vuelta">
      <div className="grid-cards">
        <div className="card">
          <div className="kpi__label">Pacientes registrados</div>
          <div className="kpi__value">{pacientes.length}</div>
          <div className="kpi__sub">En la base de la clínica</div>
        </div>
        <div className="card">
          <div className="kpi__label">Controles pendientes</div>
          <div className="kpi__value">{conControl.length}</div>
          <div className="kpi__sub is-warn">Requieren agendar o confirmar</div>
        </div>
        <div className="card">
          <div className="kpi__label">Tratamientos en curso</div>
          <div className="kpi__value">{enCurso.length}</div>
          <div className="kpi__sub">Activos actualmente</div>
        </div>
        <div className="card">
          <div className="kpi__label">Próximo control</div>
          <div className="kpi__value" style={{ fontSize: 20 }}>{primero ? formatDate(primero.proximoControl.fecha) : "Sin controles"}</div>
          <div className="kpi__sub">{primero ? `${primero.nombre} ${primero.apellidos}` : "No hay controles agendados"}</div>
        </div>
      </div>
      <div className="two-col">
        <div>
          <div className="section-title">
            Próximos controles
            <Link className="link" to="/controles">Ver todos</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Paciente</th><th>Fecha</th><th>Motivo</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {ordenados.length ? ordenados.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="cell-name"><Link to={`/pacientes/${p.id}`}>{p.nombre} {p.apellidos}</Link></td>
                    <td>{formatDate(p.proximoControl.fecha)}</td>
                    <td>{p.proximoControl.motivo}</td>
                    <td><Badge estado={estadoControl(p.proximoControl)} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4"><div className="empty-state">No hay controles próximos registrados.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="section-title">Accesos rápidos</div>
          <div className="quick-links">
            <Link className="quick-link" to="/pacientes">
              <div className="quick-link__icon"><IconPerson /></div>
              <div>
                <div className="quick-link__title">Ver pacientes</div>
                <div className="quick-link__sub">Listado completo y búsqueda</div>
              </div>
            </Link>
            <Link className="quick-link" to="/pacientes/nuevo">
              <div className="quick-link__icon"><IconPlus /></div>
              <div>
                <div className="quick-link__title">Registrar paciente</div>
                <div className="quick-link__sub">Agregar un nuevo ingreso</div>
              </div>
            </Link>
            <Link className="quick-link" to="/controles">
              <div className="quick-link__icon"><IconCalendar /></div>
              <div>
                <div className="quick-link__title">Controles pendientes</div>
                <div className="quick-link__sub">Agenda de seguimiento</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
