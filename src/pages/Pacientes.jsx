import { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import { IconPlus, IconSearch } from "../components/Icons";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import { deletePatient, getPatients } from "../data/store";
import { formatDate } from "../utils";

const FILTROS = [
  ["todos", "Todos"],
  ["activo", "Activo"],
  ["en-tratamiento", "En tratamiento"],
  ["pendiente", "Pendiente"],
  ["inactivo", "Inactivo"],
];

export default function Pacientes() {
  const toast = useToast();
  const [pacientes, setPacientes] = useState(getPatients);
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState("todos");

  const q = texto.trim().toLowerCase();
  const filtrados = pacientes.filter(
    (p) =>
      (!q || `${p.nombre} ${p.apellidos}`.toLowerCase().includes(q) || p.rut.toLowerCase().includes(q)) &&
      (estado === "todos" || p.estado === estado)
  );

  const eliminar = (p) => {
    if (!window.confirm(`¿Eliminar a ${p.nombre} ${p.apellidos}? Esta acción no se puede deshacer.`)) return;
    deletePatient(p.id);
    setPacientes(getPatients());
    toast("Paciente eliminado correctamente.");
  };

  return (
    <Layout eyebrow="Gestión de pacientes" title="Pacientes">
      <div className="toolbar">
        <div className="search-box">
          <IconSearch />
          <input placeholder="Buscar por nombre o RUT…" type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <Link className="btn btn--primary" to="/pacientes/nuevo">
          <IconPlus size={16} />
          Registrar paciente
        </Link>
      </div>
      <div className="filter-row" style={{ marginBottom: 16 }}>
        {FILTROS.map(([value, label]) => (
          <button key={value} className={`chip${estado === value ? " is-active" : ""}`} onClick={() => setEstado(value)}>{label}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>RUT</th><th>Última atención</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.length ? filtrados.map((p) => (
              <tr key={p.id}>
                <td className="cell-name">{p.nombre} {p.apellidos}</td>
                <td>{p.rut}</td>
                <td>{formatDate(p.ultimaAtencion)}</td>
                <td><Badge estado={p.estado} /></td>
                <td style={{ textAlign: "right" }}>
                  <Link className="btn btn--ghost btn--sm" to={`/pacientes/${p.id}`}>Ver paciente</Link>{" "}
                  <Link className="btn btn--ghost btn--sm" to={`/pacientes/${p.id}/editar`}>Modificar</Link>{" "}
                  <button className="btn btn--danger btn--sm" type="button" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5"><div className="empty-state">No se encontraron pacientes con ese criterio de búsqueda.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
