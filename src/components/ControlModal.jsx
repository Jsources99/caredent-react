import Field from "./Field";
import Modal from "./Modal";
import { useForm } from "../useForm";
import { todayISO } from "../utils";

// Formulario para registrar o modificar un control. Si recibe `pacientes`, muestra el selector de paciente.
export default function ControlModal({ pacientes, initial, onSave, onClose }) {
  const form = useForm(
    { pacienteId: pacientes?.[0]?.id ?? "", fecha: initial?.fecha ?? "", motivo: initial?.motivo ?? "" },
    (v) => {
      const e = {};
      if (pacientes && !v.pacienteId) e.pacienteId = "Selecciona un paciente.";
      if (!v.fecha) e.fecha = "Selecciona la fecha del control.";
      else if (!initial && v.fecha < todayISO()) e.fecha = "La fecha no puede ser anterior a hoy.";
      if (!v.motivo.trim()) e.motivo = "Ingresa el motivo del control.";
      return e;
    }
  );

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) return;
    onSave({ pacienteId: form.values.pacienteId, fecha: form.values.fecha, motivo: form.values.motivo.trim() });
  };

  return (
    <Modal title={initial ? "Modificar control" : "Registrar control"} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        {pacientes && (
          <Field form={form} name="pacienteId" label="Paciente" as="select">
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellidos}</option>
            ))}
          </Field>
        )}
        <Field form={form} name="fecha" label="Fecha del control" type="date" min={initial ? undefined : todayISO()} />
        <Field form={form} name="motivo" label="Motivo" type="text" />
        <div className="action-row">
          <button className="btn btn--ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" type="submit">Guardar control</button>
        </div>
      </form>
    </Modal>
  );
}
