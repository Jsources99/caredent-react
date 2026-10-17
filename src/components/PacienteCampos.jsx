import Field from "./Field";

export const GRUPOS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// Campos de datos personales (van dentro de un .form-grid).
export function DatosPersonales({ form, ayudas }) {
  return (
    <>
      <Field form={form} name="nombre" label="Nombre" type="text" />
      <Field form={form} name="apellidos" label="Apellidos" type="text" />
      <Field form={form} name="rut" label="RUT" type="text" placeholder={ayudas ? "12.345.678-9" : undefined} />
      <Field form={form} name="fechaNacimiento" label="Fecha de nacimiento" type="date" />
      <Field form={form} name="telefono" label="Teléfono" type="text" placeholder={ayudas ? "+56 9 1234 5678" : undefined} />
      <Field form={form} name="correo" label="Correo electrónico" type="email" placeholder={ayudas ? "nombre@correo.cl" : undefined} />
      <Field form={form} name="direccion" label="Dirección" type="text" full={ayudas}
        placeholder={ayudas ? "Calle, número, comuna" : undefined}
        hint={ayudas ? "Opcional — ayuda a contactar al paciente si es necesario." : undefined} />
    </>
  );
}

// Campos de antecedentes (van dentro de un .form-grid).
export function Antecedentes({ form, ayudas }) {
  return (
    <>
      <Field form={form} name="grupoSanguineo" label="Grupo sanguíneo" as="select">
        <option value="Por registrar">Por registrar</option>
        {GRUPOS.map((g) => <option key={g}>{g}</option>)}
      </Field>
      <Field form={form} name="alergias" label="Alergias" type="text"
        placeholder={ayudas ? "Ej: penicilina, látex" : undefined}
        hint={ayudas ? "Opcional — déjalo en blanco si no tiene alergias conocidas." : undefined} />
      <Field form={form} name="antecedentesMedicos" label="Antecedentes médicos" type="text" full={ayudas}
        placeholder={ayudas ? "Ej: hipertensión, diabetes, etc." : undefined} />
      <Field form={form} name="antecedentesOdonto" label="Antecedentes odontológicos" type="text" full={ayudas}
        placeholder={ayudas ? "Ej: ortodoncia previa, bruxismo, etc." : undefined} />
    </>
  );
}
