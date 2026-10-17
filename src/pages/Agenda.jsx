import { useState } from "react";
import Field from "../components/Field";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addAppointment, getAppointments, getPatients, getUsers, removeAppointment } from "../data/store";
import { useForm } from "../useForm";
import { formatDate, todayISO } from "../utils";

const HORAS = Array.from({ length: 18 }, (_, i) => {
  const minutos = 9 * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
});

export default function Agenda() {
  const { session } = useAuth();
  const toast = useToast();
  const [horas, setHoras] = useState(getAppointments);
  const pacientes = getPatients().filter((p) => p.estado !== "inactivo");
  const profesionales = getUsers().filter((u) => u.rol === "profesional");

  const form = useForm(
    { pacienteId: "", profesionalId: "", fecha: "", hora: "", motivo: "" },
    (v) => {
      const e = {};
      if (!v.pacienteId) e.pacienteId = "Selecciona un paciente.";
      if (!v.profesionalId) e.profesionalId = "Selecciona un profesional.";
      if (!v.fecha) e.fecha = "Selecciona la fecha.";
      else if (v.fecha < todayISO()) e.fecha = "La fecha no puede ser anterior a hoy.";
      if (!v.hora) e.hora = "Selecciona la hora.";
      if (!v.motivo.trim()) e.motivo = "Ingresa el motivo de la consulta.";
      if (v.profesionalId && v.fecha && v.hora && horas.some((h) => String(h.profesionalId) === v.profesionalId && h.fecha === v.fecha && h.hora === v.hora)) {
        e.hora = "Ese profesional ya tiene una hora agendada en ese horario.";
      }
      return e;
    }
  );

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) {
      toast("Revisa los campos marcados en rojo.", "danger");
      return;
    }
    const v = form.values;
    const paciente = pacientes.find((p) => String(p.id) === v.pacienteId);
    const profesional = profesionales.find((u) => String(u.id) === v.profesionalId);
    addAppointment({
      pacienteId: paciente.id,
      pacienteNombre: `${paciente.nombre} ${paciente.apellidos}`,
      profesionalId: profesional.id,
      profesionalNombre: profesional.nombre,
      fecha: v.fecha,
      hora: v.hora,
      motivo: v.motivo.trim(),
      agendadaPor: session.nombre,
    });
    setHoras(getAppointments());
    form.reset();
    toast("Hora agendada correctamente.");
  };

  const anular = (h) => {
    if (!window.confirm(`¿Anular la hora de ${h.pacienteNombre}?`)) return;
    removeAppointment(h.id);
    setHoras(getAppointments());
    toast("Hora anulada.");
  };

  const ordenadas = [...horas].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  return (
    <Layout eyebrow="Recepción" title="Agenda de horas">
      <div className="form-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Agendar hora</div>
        <form onSubmit={submit} noValidate>
          <div className="form-grid">
            <Field form={form} name="pacienteId" label="Paciente" as="select">
              <option value="">Selecciona un paciente</option>
              {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellidos} — {p.rut}</option>)}
            </Field>
            <Field form={form} name="profesionalId" label="Profesional" as="select">
              <option value="">Selecciona un profesional</option>
              {profesionales.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </Field>
            <Field form={form} name="fecha" label="Fecha" type="date" min={todayISO()} />
            <Field form={form} name="hora" label="Hora" as="select">
              <option value="">Selecciona una hora</option>
              {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
            </Field>
            <Field form={form} name="motivo" label="Motivo de la consulta" type="text" full />
          </div>
          <button className="btn btn--primary" type="submit">Agendar hora</button>
        </form>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Profesional</th><th>Motivo</th><th></th></tr>
          </thead>
          <tbody>
            {ordenadas.length ? ordenadas.map((h) => (
              <tr key={h.id}>
                <td className="cell-name">{h.pacienteNombre}</td>
                <td>{formatDate(h.fecha)}</td>
                <td>{h.hora}</td>
                <td>{h.profesionalNombre}</td>
                <td>{h.motivo}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn--danger btn--sm" type="button" onClick={() => anular(h)}>Anular</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6"><div className="empty-state">Aún no hay horas agendadas.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
