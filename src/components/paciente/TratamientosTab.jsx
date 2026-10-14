import { useState } from "react";
import EmptyState from "../EmptyState.jsx";
import EstadoBadge from "../EstadoBadge.jsx";
import FormField from "../FormField.jsx";
import useForm from "../../hooks/useForm.js";
import { formatDate, todayISO } from "../../utils/format.js";
import { required } from "../../utils/validators.js";

const DESCRIPCION_POR_DEFECTO = "Tratamiento registrado en la demostración.";

// Formulario para registrar o modificar un tratamiento.
// Se monta cada vez que se abre, por eso parte siempre con los valores de "inicial".
function TratamientoForm({ inicial, onGuardar, onCancelar }) {
  const form = useForm(inicial, { nombre: required("Ingresa el nombre del tratamiento.") });

  const enviar = (e) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    onGuardar({
      nombre: form.values.nombre.trim(),
      descripcion: form.values.descripcion.trim() || DESCRIPCION_POR_DEFECTO,
      estado: form.values.estado,
    });
  };

  return (
    <form className="card mb-3" onSubmit={enviar} noValidate>
      <div className="card-body">
        <div className="row g-3">
          <FormField form={form} name="nombre" id="trat-nombre" label="Nombre del tratamiento" className="col-12 col-md-8" />
          <FormField form={form} name="estado" id="trat-estado" label="Estado" as="select" className="col-12 col-md-4">
            <option value="pendiente">Pendiente</option>
            <option value="en-curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </FormField>
          <FormField form={form} name="descripcion" id="trat-descripcion" label="Descripción" as="textarea" className="col-12" />
        </div>
        <div className="d-flex gap-2 justify-content-end mt-3">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Guardar tratamiento
          </button>
        </div>
      </div>
    </form>
  );
}

// Registrar tratamientos: recepcionista y profesional. Modificar/eliminar: solo profesional.
export default function TratamientosTab({ paciente, session, onGuardar }) {
  const [editando, setEditando] = useState(null); // null | "nuevo" | índice del tratamiento
  const puedeRegistrar = session.rol !== "administrador";
  const esProfesional = session.rol === "profesional";
  const tratamientos = paciente.tratamientos;

  const guardarTratamiento = (datos) => {
    if (editando === "nuevo") {
      const nuevo = {
        id: `T-${Date.now().toString().slice(-4)}`,
        ...datos,
        fechaInicio: todayISO(),
        profesional: session.nombre,
      };
      onGuardar({ tratamientos: [...tratamientos, nuevo] }, "Tratamiento registrado.");
    } else {
      onGuardar(
        { tratamientos: tratamientos.map((t, i) => (i === editando ? { ...t, ...datos } : t)) },
        "Tratamiento modificado."
      );
    }
    setEditando(null);
  };

  const eliminar = (indice) => {
    if (!window.confirm("¿Eliminar este tratamiento?")) return;
    onGuardar({ tratamientos: tratamientos.filter((_, i) => i !== indice) }, "Tratamiento eliminado.");
  };

  const inicial =
    editando === "nuevo" || editando === null
      ? { nombre: "", descripcion: "", estado: "pendiente" }
      : {
          nombre: tratamientos[editando].nombre,
          descripcion: tratamientos[editando].descripcion,
          estado: tratamientos[editando].estado,
        };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="section-title mb-0">Tratamientos</div>
        {puedeRegistrar && editando === null && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditando("nuevo")}>
            Registrar tratamiento
          </button>
        )}
      </div>

      {editando !== null && (
        <TratamientoForm
          key={editando}
          inicial={inicial}
          onGuardar={guardarTratamiento}
          onCancelar={() => setEditando(null)}
        />
      )}

      {tratamientos.length === 0 ? (
        <EmptyState>Aún no se han registrado tratamientos para este paciente.</EmptyState>
      ) : (
        <div className="d-flex flex-column gap-2">
          {tratamientos.map((t, i) => (
            <div className="card" key={t.id}>
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                  <div className="record-title">
                    {t.nombre} <span className="cell-sub">· {t.id}</span>
                  </div>
                  <EstadoBadge estado={t.estado} />
                </div>
                <div className="record-body">
                  {t.descripcion}
                  <br />
                  <span className="cell-sub">
                    Inicio: {formatDate(t.fechaInicio)} · Profesional: {t.profesional}
                  </span>
                  {esProfesional && (
                    <div className="d-flex gap-2 mt-2">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditando(i)}>
                        Modificar
                      </button>
                      <button type="button" className="btn btn-danger-soft btn-sm" onClick={() => eliminar(i)}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
