import { useState } from "react";
import EmptyState from "../EmptyState.jsx";
import EstadoBadge from "../EstadoBadge.jsx";
import FormField from "../FormField.jsx";
import useForm from "../../hooks/useForm.js";
import { formatDate } from "../../utils/format.js";
import { required } from "../../utils/validators.js";

const MOTIVO_POR_DEFECTO = "Control de seguimiento";

function ControlForm({ inicial, onGuardar, onCancelar }) {
  const form = useForm(inicial, { fecha: required("Selecciona la fecha del control.") });

  const enviar = (e) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    onGuardar({ fecha: form.values.fecha, motivo: form.values.motivo.trim() || MOTIVO_POR_DEFECTO });
  };

  return (
    <form className="card mb-3" onSubmit={enviar} noValidate>
      <div className="card-body">
        <div className="row g-3">
          <FormField form={form} name="fecha" id="control-fecha" label="Fecha del control" type="date" className="col-12 col-md-4" />
          <FormField form={form} name="motivo" id="control-motivo" label="Motivo" className="col-12 col-md-8" placeholder={MOTIVO_POR_DEFECTO} />
        </div>
        <div className="d-flex gap-2 justify-content-end mt-3">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Guardar control
          </button>
        </div>
      </div>
    </form>
  );
}

// Registrar control: recepcionista y profesional. Modificar/eliminar: solo profesional.
export default function SeguimientoTab({ paciente, session, onGuardar }) {
  const [modo, setModo] = useState(null); // null | "nuevo" | "editar"
  const { proximoControl, seguimiento } = paciente;
  const puedeRegistrar = session.rol !== "administrador";
  const esProfesional = session.rol === "profesional";

  const guardarControl = ({ fecha, motivo }) => {
    if (modo === "editar" && proximoControl) {
      onGuardar(
        {
          proximoControl: { ...proximoControl, fecha, motivo },
          seguimiento: seguimiento.map((s) => (s.futuro ? { ...s, fecha, titulo: motivo } : s)),
        },
        "Control modificado."
      );
    } else {
      // Un control nuevo reemplaza al programado anterior.
      onGuardar(
        {
          proximoControl: { fecha, motivo, estado: "pendiente" },
          seguimiento: [
            ...seguimiento.filter((s) => !s.futuro),
            { fecha, titulo: motivo, descripcion: "Control programado.", futuro: true },
          ],
        },
        "Próximo control registrado."
      );
    }
    setModo(null);
  };

  const eliminarControl = () => {
    if (!window.confirm("¿Eliminar el próximo control?")) return;
    onGuardar(
      { proximoControl: null, seguimiento: seguimiento.filter((s) => !s.futuro) },
      "Control eliminado."
    );
  };

  const inicial =
    modo === "editar" && proximoControl
      ? { fecha: proximoControl.fecha, motivo: proximoControl.motivo }
      : { fecha: "", motivo: "" };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="section-title mb-0">Controles y evolución</div>
        {puedeRegistrar && modo === null && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setModo("nuevo")}>
            Registrar próximo control
          </button>
        )}
      </div>

      {modo !== null && (
        <ControlForm key={modo} inicial={inicial} onGuardar={guardarControl} onCancelar={() => setModo(null)} />
      )}

      <div className="section-title">Evolución del paciente</div>
      {seguimiento.length ? (
        <div className="timeline">
          {seguimiento.map((s, i) => (
            <div className={`timeline-item${s.futuro ? " is-future" : ""}`} key={`${s.fecha}-${i}`}>
              <div className="timeline-date">
                {formatDate(s.fecha)}
                {s.futuro ? " · Programado" : ""}
              </div>
              <div className="timeline-title">{s.titulo}</div>
              <div className="timeline-body">{s.descripcion}</div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>Sin evolución registrada todavía.</EmptyState>
      )}

      <div className="section-title mt-4">Próximo control</div>
      <div className="card">
        <div className="card-body">
          {proximoControl ? (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                <div className="record-title">{proximoControl.motivo}</div>
                <EstadoBadge estado={proximoControl.estado} />
              </div>
              <div className="record-body">
                Fecha programada: {formatDate(proximoControl.fecha)}
                {esProfesional && (
                  <div className="d-flex gap-2 mt-2">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModo("editar")}>
                      Modificar
                    </button>
                    <button type="button" className="btn btn-danger-soft btn-sm" onClick={eliminarControl}>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-muted">No hay un próximo control agendado para este paciente.</div>
          )}
        </div>
      </div>
    </>
  );
}
