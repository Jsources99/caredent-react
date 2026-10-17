import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "../components/Badge";
import ControlModal from "../components/ControlModal";
import Field from "../components/Field";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { deletePatient, getPatientById, removeProximoControl, setProximoControl, updatePatient } from "../data/store";
import { useForm } from "../useForm";
import { calcularEdad, estadoControl, formatDate, todayISO } from "../utils";

const TABS = [
  ["informacion", "Información"],
  ["ficha", "Ficha clínica"],
  ["diagnosticos", "Diagnósticos"],
  ["tratamientos", "Tratamientos"],
  ["atenciones", "Atenciones"],
  ["seguimiento", "Seguimiento"],
];

const ESTADOS_TRATAMIENTO = [["pendiente", "Pendiente"], ["en-curso", "En curso"], ["finalizado", "Finalizado"]];

function Info({ label, children }) {
  return (
    <div className="info-item">
      <div className="info-item__label">{label}</div>
      <div className="info-item__value">{children}</div>
    </div>
  );
}

function Registro({ titulo, children }) {
  return (
    <div className="record-card">
      <div className="record-card__head"><div className="record-card__title">{titulo}</div></div>
      <div className="record-card__body">{children}</div>
    </div>
  );
}

function TratamientoModal({ initial, onSave, onClose }) {
  const form = useForm(
    { nombre: initial?.nombre ?? "", descripcion: initial?.descripcion ?? "", estado: initial?.estado ?? "pendiente" },
    (v) => (v.nombre.trim() ? {} : { nombre: "Ingresa el nombre del tratamiento." })
  );
  const submit = (e) => {
    e.preventDefault();
    if (form.check()) onSave({ ...form.values, nombre: form.values.nombre.trim(), descripcion: form.values.descripcion.trim() });
  };
  return (
    <Modal title={initial ? "Modificar tratamiento" : "Registrar tratamiento"} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <Field form={form} name="nombre" label="Nombre del tratamiento" type="text" />
        <Field form={form} name="descripcion" label="Descripción" as="textarea" rows="3" />
        <Field form={form} name="estado" label="Estado" as="select">
          {ESTADOS_TRATAMIENTO.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Field>
        <div className="action-row">
          <button className="btn btn--ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" type="submit">Guardar tratamiento</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Paciente() {
  const { id } = useParams();
  const { session } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [p, setP] = useState(() => getPatientById(id));
  const [tab, setTab] = useState("informacion");
  const [modal, setModal] = useState(null); // { tipo: "tratamiento" | "control", index? }

  const recargar = () => setP(getPatientById(id));
  const guardar = (changes, mensaje) => {
    updatePatient(id, changes);
    recargar();
    if (mensaje) toast(mensaje);
  };

  if (!p) {
    return (
      <Layout eyebrow="Pacientes / Ficha" title="Paciente no encontrado">
        <div className="empty-state">Paciente no encontrado. <Link to="/pacientes">Volver al listado</Link>.</div>
      </Layout>
    );
  }

  const nombre = `${p.nombre} ${p.apellidos}`;
  const edad = calcularEdad(p.fechaNacimiento);
  const control = p.proximoControl;

  const eliminarPaciente = () => {
    if (!window.confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    deletePatient(id);
    toast("Paciente eliminado correctamente.");
    navigate("/pacientes");
  };

  const guardarTratamiento = (datos) => {
    const lista = [...p.tratamientos];
    if (modal.index === undefined) {
      lista.push({ id: `T-${Date.now().toString().slice(-4)}`, fechaInicio: todayISO(), profesional: session.nombre, ...datos });
    } else {
      lista[modal.index] = { ...lista[modal.index], ...datos };
    }
    guardar({ tratamientos: lista }, modal.index === undefined ? "Tratamiento registrado." : "Tratamiento modificado.");
    setModal(null);
  };

  const eliminarTratamiento = (i) => {
    if (!window.confirm("¿Eliminar este tratamiento?")) return;
    guardar({ tratamientos: p.tratamientos.filter((_, j) => j !== i) }, "Tratamiento eliminado.");
  };

  const eliminarDiagnostico = (i) => {
    if (!window.confirm("¿Eliminar este diagnóstico?")) return;
    guardar({ diagnosticos: p.diagnosticos.filter((_, j) => j !== i) });
  };

  const guardarControl = ({ fecha, motivo }) => {
    setProximoControl(id, { fecha, motivo });
    recargar();
    toast(control ? "Control modificado." : "Próximo control registrado.");
    setModal(null);
  };

  const eliminarControl = () => {
    if (!window.confirm("¿Eliminar el próximo control?")) return;
    removeProximoControl(id);
    recargar();
    toast("Control eliminado.");
  };

  return (
    <Layout eyebrow={<><Link className="text-muted" to="/pacientes">Pacientes</Link> / Ficha</>} title={nombre}>
      <div className="patient-head">
        <div className="patient-head__avatar">{(p.nombre[0] + p.apellidos[0]).toUpperCase()}</div>
        <div>
          <div className="patient-head__name">{nombre}</div>
          <div className="patient-head__meta">
            <span>{p.rut}</span>
            <span>{edad ? `${edad} años` : "Edad no disponible"}</span>
            <span>{p.telefono}</span>
          </div>
        </div>
        <div className="patient-head__actions">
          <Badge estado={p.estado} />
          <div className="action-row" style={{ marginTop: 8 }}>
            <Link className="btn btn--ghost btn--sm" to={`/pacientes/${p.id}/editar`}>Modificar</Link>
            <button className="btn btn--danger btn--sm" type="button" onClick={eliminarPaciente}>Eliminar</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(([value, label]) => (
          <button key={value} className={`tab-btn${tab === value ? " is-active" : ""}`} onClick={() => setTab(value)}>{label}</button>
        ))}
      </div>

      <div className={`tab-panel${tab === "informacion" ? " is-active" : ""}`}>
        <div className="info-grid">
          <Info label="Nombre completo">{nombre}</Info>
          <Info label="RUT">{p.rut}</Info>
          <Info label="Fecha de nacimiento">{formatDate(p.fechaNacimiento)}</Info>
          <Info label="Teléfono">{p.telefono}</Info>
          <Info label="Correo electrónico">{p.correo}</Info>
          <Info label="Dirección">{p.direccion || "—"}</Info>
          <Info label="Última atención">{formatDate(p.ultimaAtencion)}</Info>
          <Info label="Estado del paciente"><Badge estado={p.estado} /></Info>
        </div>
      </div>

      <div className={`tab-panel${tab === "ficha" ? " is-active" : ""}`}>
        <div className="info-grid" style={{ marginBottom: 16 }}>
          <Info label="Grupo sanguíneo">{p.fichaClinica.grupoSanguineo}</Info>
          <Info label="Ficha creada el">{formatDate(p.fichaClinica.fechaCreacion)}</Info>
        </div>
        <div className="record-list">
          <Registro titulo="Observaciones generales">{p.fichaClinica.observaciones}</Registro>
          <Registro titulo="Antecedentes médicos">{p.antecedentes.medicos}</Registro>
          <Registro titulo="Antecedentes odontológicos">{p.antecedentes.odontologicos}</Registro>
          <Registro titulo="Alergias">{p.antecedentes.alergias}</Registro>
        </div>
      </div>

      <div className={`tab-panel${tab === "diagnosticos" ? " is-active" : ""}`}>
        <div className="record-list">
          {p.diagnosticos.length ? p.diagnosticos.map((d, i) => (
            <div className="record-card" key={i}>
              <div className="record-card__head">
                <div className="record-card__title">{d.descripcion}</div>
                <div className="record-card__date">{formatDate(d.fecha)}</div>
              </div>
              <div className="record-card__body">
                Registrado por {d.profesional}.{" "}
                <button className="btn btn--danger btn--sm" type="button" onClick={() => eliminarDiagnostico(i)}>Eliminar</button>
              </div>
            </div>
          )) : <div className="empty-state">Aún no se han registrado diagnósticos para este paciente.</div>}
        </div>
      </div>

      <div className={`tab-panel${tab === "tratamientos" ? " is-active" : ""}`}>
        <div className="section-title">Tratamientos</div>
        <div className="action-row" style={{ marginBottom: 16 }}>
          <button className="btn btn--primary btn--sm" type="button" onClick={() => setModal({ tipo: "tratamiento" })}>Registrar tratamiento</button>
        </div>
        <div className="record-list">
          {p.tratamientos.length ? p.tratamientos.map((t, i) => (
            <div className="record-card" key={t.id}>
              <div className="record-card__head">
                <div className="record-card__title">{t.nombre} <span className="cell-sub">· {t.id}</span></div>
                <Badge estado={t.estado} />
              </div>
              <div className="record-card__body">
                {t.descripcion}<br />
                <span className="cell-sub">Inicio: {formatDate(t.fechaInicio)} · Profesional: {t.profesional}</span><br />
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ tipo: "tratamiento", index: i })}>Modificar</button>{" "}
                <button className="btn btn--danger btn--sm" type="button" onClick={() => eliminarTratamiento(i)}>Eliminar</button>
              </div>
            </div>
          )) : <div className="empty-state">Aún no se han registrado tratamientos para este paciente.</div>}
        </div>
      </div>

      <div className={`tab-panel${tab === "atenciones" ? " is-active" : ""}`}>
        <div className="record-list">
          {p.atenciones.length ? p.atenciones.map((a, i) => (
            <div className="record-card" key={i}>
              <div className="record-card__head">
                <div className="record-card__title">{a.motivo}</div>
                <div className="record-card__date">{formatDate(a.fecha)}</div>
              </div>
              <div className="record-card__body">{a.notas}<br /><span className="cell-sub">Atendido por {a.profesional}</span></div>
            </div>
          )) : <div className="empty-state">Aún no se han registrado atenciones para este paciente.</div>}
        </div>
      </div>

      <div className={`tab-panel${tab === "seguimiento" ? " is-active" : ""}`}>
        <div className="section-title">Controles y evolución</div>
        <div className="action-row" style={{ marginBottom: 16 }}>
          <button className="btn btn--primary btn--sm" type="button" onClick={() => setModal({ tipo: "control" })}>Registrar próximo control</button>
        </div>
        <div className="section-title">Evolución del paciente</div>
        <div className="timeline">
          {p.seguimiento.length ? p.seguimiento.map((s, i) => (
            <div className={`timeline-item${s.futuro ? " is-future" : ""}`} key={i}>
              <div className="timeline-item__date">{formatDate(s.fecha)}{s.futuro ? " · Programado" : ""}</div>
              <div className="timeline-item__title">{s.titulo}</div>
              <div className="timeline-item__body">{s.descripcion}</div>
            </div>
          )) : <div className="empty-state">Sin evolución registrada todavía.</div>}
        </div>
        <div className="section-title mt-24">Próximo control</div>
        <div className="card">
          {control ? (
            <>
              <div className="record-card__head">
                <div className="record-card__title">{control.motivo}</div>
                <Badge estado={estadoControl(control)} />
              </div>
              <div className="record-card__body">
                Fecha programada: {formatDate(control.fecha)}<br />
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setModal({ tipo: "control", editar: true })}>Modificar</button>{" "}
                <button className="btn btn--danger btn--sm" type="button" onClick={eliminarControl}>Eliminar</button>
              </div>
            </>
          ) : <div className="text-muted">No hay un próximo control agendado para este paciente.</div>}
        </div>
      </div>

      {modal?.tipo === "tratamiento" && (
        <TratamientoModal initial={modal.index === undefined ? null : p.tratamientos[modal.index]} onSave={guardarTratamiento} onClose={() => setModal(null)} />
      )}
      {modal?.tipo === "control" && (
        <ControlModal initial={modal.editar ? control : null} onSave={guardarControl} onClose={() => setModal(null)} />
      )}
    </Layout>
  );
}
