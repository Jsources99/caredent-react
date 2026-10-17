import { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import ControlModal from "../components/ControlModal";
import { IconPlus } from "../components/Icons";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import { getPatients, setProximoControl } from "../data/store";
import { estadoControl, formatDate } from "../utils";

const FILTROS = [
  ["todos", "Todos"],
  ["pendiente", "Pendientes"],
  ["vencido", "Vencidos"],
  ["sin", "Sin control"],
];

export default function Controles() {
  const toast = useToast();
  const [pacientes, setPacientes] = useState(getPatients);
  const [filtro, setFiltro] = useState("todos");
  const [abierto, setAbierto] = useState(false);

  const filas = pacientes
    .map((p) => ({ p, estado: estadoControl(p.proximoControl) }))
    .filter(({ estado }) => filtro === "todos" || (filtro === "sin" ? !estado : estado === filtro));

  const guardar = ({ pacienteId, fecha, motivo }) => {
    setProximoControl(pacienteId, { fecha, motivo });
    setPacientes(getPatients());
    setAbierto(false);
    toast("Próximo control registrado.");
  };

  return (
    <Layout eyebrow="Seguimiento de pacientes" title="Controles">
      <div className="toolbar">
        <div className="filter-row" style={{ marginBottom: 0 }}>
          {FILTROS.map(([value, label]) => (
            <button key={value} className={`chip${filtro === value ? " is-active" : ""}`} onClick={() => setFiltro(value)}>{label}</button>
          ))}
        </div>
        <button className="btn btn--primary" type="button" onClick={() => setAbierto(true)}>
          <IconPlus size={16} />
          Registrar control
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Paciente</th><th>Fecha</th><th>Motivo</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {filas.length ? filas.map(({ p, estado }) => (
              <tr key={p.id}>
                <td className="cell-name">{p.nombre} {p.apellidos}</td>
                <td>{p.proximoControl ? formatDate(p.proximoControl.fecha) : "Sin control"}</td>
                <td>{p.proximoControl ? p.proximoControl.motivo : "No registrado"}</td>
                <td>{estado ? <Badge estado={estado} /> : "—"}</td>
                <td style={{ textAlign: "right" }}>
                  <Link className="btn btn--ghost btn--sm" to={`/pacientes/${p.id}`}>Consultar paciente</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5"><div className="empty-state">No hay pacientes que coincidan con este filtro.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
      {abierto && (
        <ControlModal pacientes={pacientes.filter((p) => p.estado !== "inactivo")} onSave={guardar} onClose={() => setAbierto(false)} />
      )}
    </Layout>
  );
}
