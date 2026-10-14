// Capa de datos. No hay backend: localStorage simula la persistencia
// para que los datos se mantengan entre pantallas durante la demostración.

import { seedPatients, USUARIOS_INICIALES } from "../data/seed.js";
import { ROL_LABEL, todayISO } from "../utils/format.js";

export const STORAGE_KEYS = {
  patients: "caredent_pacientes",
  users: "caredent_usuarios",
  deletedUsers: "caredent_usuarios_papelera",
  session: "caredent_sesion",
};

function leer(key, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? porDefecto;
  } catch (e) {
    return porDefecto;
  }
}

function escribir(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

export function ensureSeedData() {
  if (!localStorage.getItem(STORAGE_KEYS.patients)) escribir(STORAGE_KEYS.patients, seedPatients());
  if (!localStorage.getItem(STORAGE_KEYS.users)) escribir(STORAGE_KEYS.users, USUARIOS_INICIALES);
}

/* ------------------------------ Pacientes ------------------------------ */

export function getPatients() {
  ensureSeedData();
  return leer(STORAGE_KEYS.patients, []);
}

export function savePatients(lista) {
  escribir(STORAGE_KEYS.patients, lista);
}

export function getPatientById(id) {
  return getPatients().find((p) => String(p.id) === String(id));
}

export function addPatient(patient) {
  const lista = getPatients();
  const nextId = lista.length ? Math.max(...lista.map((p) => p.id)) + 1 : 1;
  const nuevo = {
    id: nextId,
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
  lista.unshift(nuevo);
  savePatients(lista);
  return nuevo;
}

export function updatePatient(id, cambios) {
  const lista = getPatients();
  const index = lista.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;
  lista[index] = { ...lista[index], ...cambios };
  savePatients(lista);
  return lista[index];
}

export function deletePatient(id) {
  const lista = getPatients();
  const siguiente = lista.filter((p) => String(p.id) !== String(id));
  if (siguiente.length === lista.length) return false;
  savePatients(siguiente);
  return true;
}

/* ------------------------------- Usuarios ------------------------------ */

export function getUsers() {
  ensureSeedData();
  return leer(STORAGE_KEYS.users, []);
}

function saveUsers(lista) {
  escribir(STORAGE_KEYS.users, lista);
}

export function addUser(user) {
  const lista = getUsers();
  const nextId = lista.length ? Math.max(...lista.map((u) => u.id)) + 1 : 1;
  const nuevo = { id: nextId, ...user };
  lista.push(nuevo);
  saveUsers(lista);
  return nuevo;
}

export function getDeletedUsers() {
  return leer(STORAGE_KEYS.deletedUsers, []);
}

function saveDeletedUsers(lista) {
  escribir(STORAGE_KEYS.deletedUsers, lista);
}

// Al eliminar, el usuario pasa a una "papelera" y se puede restaurar.
export function deleteUser(id) {
  const session = getSession();
  if (session && String(session.userId) === String(id)) return false;
  const lista = getUsers();
  const usuario = lista.find((u) => String(u.id) === String(id));
  if (!usuario) return false;
  saveUsers(lista.filter((u) => String(u.id) !== String(id)));
  const papelera = getDeletedUsers();
  papelera.unshift({ ...usuario, eliminadoEl: new Date().toISOString() });
  saveDeletedUsers(papelera);
  return true;
}

export function restoreUser(id) {
  const papelera = getDeletedUsers();
  const usuario = papelera.find((u) => String(u.id) === String(id));
  if (!usuario) return false;
  const { eliminadoEl, ...datos } = usuario;
  const lista = getUsers();
  // Evita duplicar el nombre de usuario si otra cuenta ya lo tomó.
  if (lista.some((u) => u.usuario.toLowerCase() === datos.usuario.toLowerCase())) return false;
  lista.push(datos);
  saveUsers(lista);
  saveDeletedUsers(papelera.filter((u) => String(u.id) !== String(id)));
  return datos;
}

export function permanentlyDeleteUser(id) {
  const papelera = getDeletedUsers();
  const siguiente = papelera.filter((u) => String(u.id) !== String(id));
  if (siguiente.length === papelera.length) return false;
  saveDeletedUsers(siguiente);
  return true;
}

/* -------------------------------- Sesión ------------------------------- */

export function attemptLogin(usuario, clave, rolSeleccionado) {
  const match = getUsers().find(
    (u) => u.usuario === usuario.trim().toLowerCase() && u.clave === clave
  );
  if (!match) return { ok: false, error: "Usuario o contraseña incorrectos." };
  if (rolSeleccionado && match.rol !== rolSeleccionado) {
    return { ok: false, error: `Ese usuario corresponde al rol "${ROL_LABEL[match.rol]}".` };
  }
  const session = { userId: match.id, usuario: match.usuario, rol: match.rol, nombre: match.nombre, inicio: Date.now() };
  escribir(STORAGE_KEYS.session, session);
  return { ok: true, session };
}

export function getSession() {
  return leer(STORAGE_KEYS.session, null);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}
