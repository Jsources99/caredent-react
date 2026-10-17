import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../components/Field";
import Layout from "../components/Layout";
import { Antecedentes, DatosPersonales } from "../components/PacienteCampos";
import { useToast } from "../context/ToastContext";
import { getPatientById, getPatients, updatePatient } from "../data/store";
import { useForm } from "../useForm";
import { validarPaciente } from "../utils";

export default function EditarPaciente() {
  const { id } = useParams();
  const paciente = getPatientById(id);
  return (
    <Layout eyebrow="Gestión de pacientes" title="Modificar paciente">
      {paciente ? (
        <Formulario paciente={paciente} />
      ) : (
        <div className="empty-state">Paciente no encontrado. <Link to="/pacientes">Volver al listado</Link>.</div>
      )}
    </Layout>
  );
}

function Formulario({ paciente }) {
  const toast = useToast();
  const navigate = useNavigate();
  const form = useForm(
    {
      nombre: paciente.nombre, apellidos: paciente.apellidos, rut: paciente.rut,
      fechaNacimiento: paciente.fechaNacimiento || "", telefono: paciente.telefono, correo: paciente.correo,
      direccion: paciente.direccion || "", estado: paciente.estado,
      grupoSanguineo: paciente.fichaClinica?.grupoSanguineo || "Por registrar",
      alergias: paciente.antecedentes?.alergias || "",
      antecedentesMedicos: paciente.antecedentes?.medicos || "",
      antecedentesOdonto: paciente.antecedentes?.odontologicos || "",
    },
    (v) => validarPaciente(v, { pacientes: getPatients(), selfId: paciente.id, originalRut: paciente.rut })
  );

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) {
      toast("Revisa los campos marcados en rojo.", "danger");
      return;
    }
    const v = form.values;
    updatePatient(paciente.id, {
      nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), rut: v.rut.trim(),
      fechaNacimiento: v.fechaNacimiento, telefono: v.telefono.trim(), correo: v.correo.trim(),
      direccion: v.direccion.trim() || "Por registrar", estado: v.estado,
      antecedentes: {
        medicos: v.antecedentesMedicos.trim() || "Por registrar.",
        odontologicos: v.antecedentesOdonto.trim() || "Por registrar.",
        alergias: v.alergias.trim() || "Sin alergias conocidas.",
      },
      fichaClinica: { ...(paciente.fichaClinica || {}), grupoSanguineo: v.grupoSanguineo },
    });
    toast("Información del paciente actualizada correctamente.");
    navigate(`/pacientes/${paciente.id}`);
  };

  return (
    <div className="form-card">
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <DatosPersonales form={form} />
          <Antecedentes form={form} />
          <Field form={form} name="estado" label="Estado" as="select">
            <option value="activo">Activo</option>
            <option value="en-tratamiento">En tratamiento</option>
            <option value="pendiente">Pendiente</option>
            <option value="inactivo">Inactivo</option>
          </Field>
        </div>
        <div className="action-row" style={{ marginTop: 20 }}>
          <Link className="btn btn--ghost" to={`/pacientes/${paciente.id}`}>Cancelar</Link>
          <button className="btn btn--primary" type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>
  );
}
