// Persistencia simulada con localStorage (no hay backend). Mismas claves que la versión original.
import { seedPatients, USUARIOS_INICIALES } from "./seed";
import { todayISO, ROL_LABEL } from "../utils";

const KEYS = {
  patients: "caredent_pacientes",
  users: "caredent_usuarios",
  deletedUsers: "caredent_usuarios_papelera",
  session: "caredent_sesion",
  appointments: "caredent_horas",
};

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const nextId = (list) => (list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1);

function ensureSeedData() {
  if (!localStorage.getItem(KEYS.patients)) write(KEYS.patients, seedPatients());
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, USUARIOS_INICIALES);
}

/* ---- Pacientes ---- */
export function getPatients() {
  ensureSeedData();
  return read(KEYS.patients, []);
}
export const getPatientById = (id) => getPatients().find((p) => String(p.id) === String(id));

export function addPatient(patient) {
  const list = getPatients();
  const nuevo = {
    id: nextId(list),
    estado: "pendiente",
    ultimaAtencion: "—",
    antecedentes: { medicos: "Por registrar.", odontologicos: "Por registrar.", alergias: "Por registrar." },
    fichaClinica: { grupoSanguineo: "Por registrar", fechaCreacion: todayISO(), observaciones: "Ficha creada al momento del registro." },
    diagnosticos: [],
    tratamientos: [],
    atenciones: [],
    seguimiento: [{ fecha: todayISO(), titulo: "Ingreso al sistema", descripcion: "Paciente registrado en Caredent.", futuro: false }],
    proximoControl: null,
    ...patient,
  };
  write(KEYS.patients, [nuevo, ...list]);
  return nuevo;
}

export function updatePatient(id, changes) {
  const list = getPatients();
  const i = list.findIndex((p) => String(p.id) === String(id));
  if (i === -1) return null;
  list[i] = { ...list[i], ...changes };
  write(KEYS.patients, list);
  return list[i];
}

export function deletePatient(id) {
  write(KEYS.patients, getPatients().filter((p) => String(p.id) !== String(id)));
}

/* ---- Controles (solo el profesional los registra) ---- */
export function setProximoControl(patientId, { fecha, motivo }) {
  const p = getPatientById(patientId);
  if (!p) return null;
  const seguimiento = (p.seguimiento || []).filter((s) => !s.futuro);
  seguimiento.push({ fecha, titulo: motivo, descripcion: "Control programado.", futuro: true });
  return updatePatient(patientId, { proximoControl: { fecha, motivo, estado: "pendiente" }, seguimiento });
}

export function removeProximoControl(patientId) {
  const p = getPatientById(patientId);
  if (!p) return null;
  return updatePatient(patientId, { proximoControl: null, seguimiento: (p.seguimiento || []).filter((s) => !s.futuro) });
}

/* ---- Usuarios ---- */
export function getUsers() {
  ensureSeedData();
  return read(KEYS.users, []);
}
const saveUsers = (list) => write(KEYS.users, list);
export const getDeletedUsers = () => read(KEYS.deletedUsers, []);
const saveDeletedUsers = (list) => write(KEYS.deletedUsers, list);

export function addUser(user) {
  const list = getUsers();
  const nuevo = { id: nextId(list), ...user };
  saveUsers([...list, nuevo]);
  return nuevo;
}

// El administrador solo gestiona usuarios "profesional" y "recepcionista".
export const ROLES_GESTIONABLES = ["profesional", "recepcionista"];

export function deleteUser(id) {
  const usuario = getUsers().find((u) => String(u.id) === String(id));
  if (!usuario || !ROLES_GESTIONABLES.includes(usuario.rol)) return false;
  saveUsers(getUsers().filter((u) => u.id !== usuario.id));
  saveDeletedUsers([{ ...usuario, eliminadoEl: new Date().toISOString() }, ...getDeletedUsers()]);
  return true;
}

export function restoreUser(id) {
  const papelera = getDeletedUsers();
  const usuario = papelera.find((u) => String(u.id) === String(id));
  if (!usuario) return false;
  const { eliminadoEl, ...datos } = usuario;
  const list = getUsers();
  if (list.some((u) => u.usuario.toLowerCase() === datos.usuario.toLowerCase())) return false;
  saveUsers([...list, datos]);
  saveDeletedUsers(papelera.filter((u) => u.id !== usuario.id));
  return true;
}

export function permanentlyDeleteUser(id) {
  saveDeletedUsers(getDeletedUsers().filter((u) => String(u.id) !== String(id)));
}

/* ---- Sesión ---- */
export function getSession() {
  return read(KEYS.session, null);
}

export function attemptLogin(usuario, clave, rolSeleccionado) {
  const match = getUsers().find((u) => u.usuario === usuario.trim().toLowerCase() && u.clave === clave);
  if (!match) return { ok: false, error: "Usuario o contraseña incorrectos." };
  if (rolSeleccionado && match.rol !== rolSeleccionado) {
    return { ok: false, error: `Ese usuario corresponde al rol "${ROL_LABEL[match.rol]}".` };
  }
  const session = { userId: match.id, usuario: match.usuario, rol: match.rol, nombre: match.nombre, inicio: Date.now() };
  write(KEYS.session, session);
  return { ok: true, session };
}

export const clearSession = () => localStorage.removeItem(KEYS.session);

/* ---- Horas agendadas (recepcionista) ---- */
export const getAppointments = () => read(KEYS.appointments, []);

export function addAppointment(data) {
  const list = getAppointments();
  const nueva = { id: nextId(list), ...data };
  write(KEYS.appointments, [...list, nueva]);
  return nueva;
}

export function removeAppointment(id) {
  write(KEYS.appointments, getAppointments().filter((a) => a.id !== id));
}
