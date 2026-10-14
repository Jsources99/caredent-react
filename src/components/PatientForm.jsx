import { Link } from "react-router-dom";
import FormField from "./FormField.jsx";
import useForm from "../hooks/useForm.js";
import { useToast } from "../context/ToastContext.jsx";
import { compose, email, phone, required, rut } from "../utils/validators.js";

const MSG_RUT = "Ingresa un RUT válido, formato 12.345.678-9.";
const MSG_TELEFONO = "Ingresa un teléfono de contacto válido.";
const MSG_CORREO = "Ingresa un correo electrónico válido.";

// Reglas de validación de cada campo.
const VALIDADORES = {
  nombre: required("Ingresa el nombre del paciente."),
  apellidos: required("Ingresa los apellidos del paciente."),
  rut: compose(required(MSG_RUT), rut(MSG_RUT)),
  fechaNacimiento: required("Selecciona la fecha de nacimiento."),
  telefono: compose(required(MSG_TELEFONO), phone(MSG_TELEFONO)),
  correo: compose(required(MSG_CORREO), email(MSG_CORREO)),
};

export const VALORES_VACIOS = {
  nombre: "",
  apellidos: "",
  rut: "",
  fechaNacimiento: "",
  telefono: "",
  correo: "",
  direccion: "",
  grupoSanguineo: "Por registrar",
  alergias: "",
  antecedentesMedicos: "",
  antecedentesOdonto: "",
  motivoConsulta: "",
  estado: "pendiente",
};

const GRUPOS = ["Por registrar", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// Formulario compartido por "Registrar paciente" y "Modificar paciente".
//   modo: "registrar" | "editar"
//   initialValues: valores iniciales de los campos
//   onSubmit(values): se llama solo si todo es válido
//   cancelTo: ruta del botón Cancelar
export default function PatientForm({ modo, initialValues, onSubmit, cancelTo }) {
  const form = useForm(initialValues, VALIDADORES);
  const showToast = useToast();
  const editando = modo === "editar";

  const enviar = (e) => {
    e.preventDefault();
    if (!form.validateAll()) {
      showToast("Revisa los campos marcados en rojo.", "danger");
      return;
    }
    onSubmit(form.values);
  };

  return (
    <form className="card form-card" onSubmit={enviar} noValidate>
      <div className="card-body p-3 p-md-4">
        <h2 className="form-section-title">Datos personales</h2>
        <div className="row g-3">
          <FormField form={form} name="nombre" label="Nombre" />
          <FormField form={form} name="apellidos" label="Apellidos" />
          <FormField form={form} name="rut" label="RUT" placeholder="12.345.678-9" />
          <FormField form={form} name="fechaNacimiento" label="Fecha de nacimiento" type="date" />
          <FormField form={form} name="telefono" label="Teléfono" placeholder="+56 9 1234 5678" />
          <FormField form={form} name="correo" label="Correo electrónico" type="email" placeholder="nombre@correo.cl" />
          <FormField
            form={form}
            name="direccion"
            label="Dirección"
            className="col-12"
            placeholder="Calle, número, comuna"
            hint="Opcional — ayuda a contactar al paciente si es necesario."
          />
        </div>

        <h2 className="form-section-title">Antecedentes básicos</h2>
        <div className="row g-3">
          <FormField form={form} name="grupoSanguineo" label="Grupo sanguíneo" as="select">
            {GRUPOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </FormField>
          <FormField
            form={form}
            name="alergias"
            label="Alergias"
            placeholder="Ej: penicilina, látex"
            hint="Opcional — déjalo en blanco si no tiene alergias conocidas."
          />
          <FormField
            form={form}
            name="antecedentesMedicos"
            label="Antecedentes médicos"
            className="col-12"
            placeholder="Ej: hipertensión, diabetes, etc."
          />
          <FormField
            form={form}
            name="antecedentesOdonto"
            label="Antecedentes odontológicos"
            className="col-12"
            placeholder="Ej: ortodoncia previa, bruxismo, etc."
          />

          {editando ? (
            <FormField form={form} name="estado" label="Estado" as="select">
              <option value="activo">Activo</option>
              <option value="en-tratamiento">En tratamiento</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
            </FormField>
          ) : (
            <FormField
              form={form}
              name="motivoConsulta"
              label="Motivo de la primera consulta"
              as="textarea"
              className="col-12"
              placeholder="Ej: dolor en molar inferior derecho, control de rutina, etc."
              hint="Esta información se usará para crear la ficha clínica inicial."
            />
          )}
        </div>

        <div className="form-actions d-flex flex-column-reverse flex-sm-row justify-content-sm-end gap-2">
          <Link className="btn btn-ghost" to={cancelTo}>
            Cancelar
          </Link>
          <button className="btn btn-primary" type="submit">
            {editando ? "Guardar cambios" : "Registrar paciente"}
          </button>
        </div>
      </div>
    </form>
  );
}
