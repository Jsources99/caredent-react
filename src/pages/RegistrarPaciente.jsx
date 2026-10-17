import { Link, useNavigate } from "react-router-dom";
import { Antecedentes, DatosPersonales } from "../components/PacienteCampos";
import Field from "../components/Field";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import { addPatient, getPatients } from "../data/store";
import { useForm } from "../useForm";
import { todayISO, validarPaciente } from "../utils";

const INICIAL = {
  nombre: "", apellidos: "", rut: "", fechaNacimiento: "", telefono: "", correo: "", direccion: "",
  grupoSanguineo: "Por registrar", alergias: "", antecedentesMedicos: "", antecedentesOdonto: "", motivoConsulta: "",
};

export default function RegistrarPaciente() {
  const toast = useToast();
  const navigate = useNavigate();
  const form = useForm(INICIAL, (v) => validarPaciente(v, { pacientes: getPatients() }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.check()) {
      toast("Revisa los campos marcados en rojo.", "danger");
      return;
    }
    const v = form.values;
    const motivo = v.motivoConsulta.trim();
    const nuevo = addPatient({
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      rut: v.rut.trim(),
      fechaNacimiento: v.fechaNacimiento,
      telefono: v.telefono.trim(),
      correo: v.correo.trim(),
      direccion: v.direccion.trim() || "Por registrar",
      antecedentes: {
        medicos: v.antecedentesMedicos.trim() || "Por registrar.",
        odontologicos: v.antecedentesOdonto.trim() || "Por registrar.",
        alergias: v.alergias.trim() || "Sin alergias conocidas.",
      },
      fichaClinica: { grupoSanguineo: v.grupoSanguineo, fechaCreacion: todayISO(), observaciones: "Ficha creada al momento del registro." },
      atenciones: motivo ? [{ fecha: todayISO(), motivo: "Primera consulta", profesional: "Por asignar", notas: motivo }] : [],
    });
    toast(`Paciente ${nuevo.nombre} ${nuevo.apellidos} registrado correctamente.`);
    navigate(`/pacientes/${nuevo.id}`);
  };

  return (
    <Layout eyebrow="Gestión de pacientes" title="Registrar paciente">
      <form className="form-card" onSubmit={submit} noValidate>
        <div className="form-section-title">Datos personales</div>
        <div className="form-grid">
          <DatosPersonales form={form} ayudas />
        </div>
        <div className="form-section-title">Antecedentes básicos</div>
        <div className="form-grid">
          <Antecedentes form={form} ayudas />
          <Field form={form} name="motivoConsulta" label="Motivo de la primera consulta" as="textarea" rows="3" full
            placeholder="Ej: dolor en molar inferior derecho, control de rutina, etc."
            hint="Esta información se usará para crear la ficha clínica inicial." />
        </div>
        <div className="form-actions">
          <Link className="btn btn--ghost" to="/pacientes">Cancelar</Link>
          <button className="btn btn--primary" type="submit">Registrar paciente</button>
        </div>
      </form>
    </Layout>
  );
}
