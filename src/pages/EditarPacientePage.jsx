import { Link, useNavigate, useParams } from "react-router-dom";
import PatientForm from "../components/PatientForm.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getPatientById, updatePatient } from "../services/storage.js";

export default function EditarPacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const paciente = getPatientById(id);

  if (!paciente) {
    return (
      <div className="alert alert-danger" role="alert">
        Paciente no encontrado. <Link to="/pacientes">Volver al listado</Link>.
      </div>
    );
  }

  // El formulario parte con los datos actuales del paciente.
  const valores = {
    nombre: paciente.nombre || "",
    apellidos: paciente.apellidos || "",
    rut: paciente.rut || "",
    fechaNacimiento: paciente.fechaNacimiento || "",
    telefono: paciente.telefono || "",
    correo: paciente.correo || "",
    direccion: paciente.direccion || "",
    estado: paciente.estado || "pendiente",
    grupoSanguineo: paciente.fichaClinica?.grupoSanguineo || "Por registrar",
    alergias: paciente.antecedentes?.alergias || "",
    antecedentesMedicos: paciente.antecedentes?.medicos || "",
    antecedentesOdonto: paciente.antecedentes?.odontologicos || "",
    motivoConsulta: "",
  };

  const guardar = (v) => {
    updatePatient(paciente.id, {
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      rut: v.rut.trim(),
      fechaNacimiento: v.fechaNacimiento,
      telefono: v.telefono.trim(),
      correo: v.correo.trim(),
      direccion: v.direccion.trim() || "Por registrar",
      estado: v.estado,
      antecedentes: {
        medicos: v.antecedentesMedicos.trim() || "Por registrar.",
        odontologicos: v.antecedentesOdonto.trim() || "Por registrar.",
        alergias: v.alergias.trim() || "Sin alergias conocidas.",
      },
      fichaClinica: { ...(paciente.fichaClinica || {}), grupoSanguineo: v.grupoSanguineo },
    });
    showToast("Información del paciente actualizada correctamente.");
    navigate(`/pacientes/${paciente.id}`);
  };

  return (
    <PatientForm
      key={paciente.id}
      modo="editar"
      initialValues={valores}
      onSubmit={guardar}
      cancelTo={`/pacientes/${paciente.id}`}
    />
  );
}
