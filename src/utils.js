export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function formatDate(iso) {
  if (!iso || iso === "—") return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

export function initials(nombre = "") {
  return nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function calcularEdad(fechaISO) {
  if (!fechaISO) return null;
  const nac = new Date(fechaISO);
  if (isNaN(nac)) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

export const ROL_LABEL = {
  administrador: "Administrador",
  recepcionista: "Recepcionista",
  profesional: "Médico / Profesional",
};

export const ESTADOS = {
  activo: { label: "Activo", badge: "badge--ok" },
  "en-tratamiento": { label: "En tratamiento", badge: "badge--warn" },
  pendiente: { label: "Pendiente", badge: "badge--warn" },
  inactivo: { label: "Inactivo", badge: "badge--muted" },
  "en-curso": { label: "En curso", badge: "badge--warn" },
  finalizado: { label: "Finalizado", badge: "badge--ok" },
  confirmado: { label: "Confirmado", badge: "badge--ok" },
  vencido: { label: "Vencido", badge: "badge--danger" },
};

// Un control pendiente cuya fecha ya pasó se muestra como "vencido".
export function estadoControl(control) {
  if (!control) return null;
  if (control.estado === "pendiente" && control.fecha < todayISO()) return "vencido";
  return control.estado;
}

/* ---- Validaciones ---- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RUT_RE = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
const PHONE_RE = /^\+?\d[\d\s]{6,}$/;

const normRut = (r) => r.replace(/\./g, "").toUpperCase();

function rutDvOk(rut) {
  const [cuerpo, dv] = normRut(rut).split("-");
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  return dv === (r === 11 ? "0" : r === 10 ? "K" : String(r));
}

// Valida los datos de un paciente. `originalRut` permite editar fichas de
// demostración sin obligar a cambiar su RUT ficticio.
export function validarPaciente(v, { pacientes, selfId = null, originalRut = null }) {
  const e = {};
  if (!v.nombre.trim()) e.nombre = "Ingresa el nombre del paciente.";
  if (!v.apellidos.trim()) e.apellidos = "Ingresa los apellidos del paciente.";
  const rut = v.rut.trim();
  if (!RUT_RE.test(rut)) e.rut = "Ingresa un RUT válido, formato 12.345.678-9.";
  else if (pacientes.some((p) => p.id !== selfId && normRut(p.rut) === normRut(rut))) e.rut = "Ya existe un paciente con ese RUT.";
  else if (rut !== originalRut && !rutDvOk(rut)) e.rut = "El dígito verificador del RUT no es correcto.";
  if (!v.fechaNacimiento) e.fechaNacimiento = "Selecciona la fecha de nacimiento.";
  else if (v.fechaNacimiento > todayISO()) e.fechaNacimiento = "La fecha de nacimiento no puede ser futura.";
  if (!PHONE_RE.test(v.telefono.trim())) e.telefono = "Ingresa un teléfono de contacto válido.";
  if (!EMAIL_RE.test(v.correo.trim())) e.correo = "Ingresa un correo electrónico válido.";
  return e;
}
