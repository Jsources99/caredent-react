import { useNavigate } from "react-router-dom";
import PatientForm, { VALORES_VACIOS } from "../components/PatientForm.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { addPatient } from "../services/storage.js";
import { todayISO } from "../utils/format.js";

export default function RegistrarPacientePage() {
  const navigate = useNavigate();
  const showToast = useToast();

  const guardar = (v) => {
    const hoy = todayISO();
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
      fichaClinica: {
        grupoSanguineo: v.grupoSanguineo,
        fechaCreacion: hoy,
        observaciones: "Ficha creada al momento del registro.",
      },
      atenciones: motivo
        ? [{ fecha: hoy, motivo: "Primera consulta", profesional: "Por asignar", notas: motivo }]
        : [],
    });
    showToast(`Paciente ${nuevo.nombre} ${nuevo.apellidos} registrado correctamente.`);
    navigate(`/pacientes/${nuevo.id}`);
  };

  return <PatientForm modo="registrar" initialValues={VALORES_VACIOS} onSubmit={guardar} cancelTo="/pacientes" />;
}
