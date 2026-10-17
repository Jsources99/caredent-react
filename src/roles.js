// Qué puede ver cada rol.
//  - administrador: solo administra usuarios "profesional" y "recepcionista".
//  - recepcionista: solo agenda horas.
//  - profesional: pacientes, fichas clínicas y es el único que registra/ve controles.
export const HOME = {
  administrador: "/usuarios",
  recepcionista: "/agenda",
  profesional: "/",
};
