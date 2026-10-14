// Funciones de apoyo para mostrar datos (fechas, iniciales, etiquetas).

export const ROL_LABEL = {
  administrador: "Administrador",
  recepcionista: "Recepcionista",
  profesional: "Profesional",
};

// Etiqueta y clase CSS de cada estado (se usa en <EstadoBadge />).
export const ESTADOS = {
  activo: { label: "Activo", clase: "estado-ok" },
  "en-tratamiento": { label: "En tratamiento", clase: "estado-warn" },
  pendiente: { label: "Pendiente", clase: "estado-warn" },
  inactivo: { label: "Inactivo", clase: "estado-muted" },
  "en-curso": { label: "En curso", clase: "estado-warn" },
  finalizado: { label: "Finalizado", clase: "estado-ok" },
  confirmado: { label: "Confirmado", clase: "estado-ok" },
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(iso) {
  if (!iso || iso === "—") return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

export function calcularEdad(fechaISO) {
  if (!fechaISO) return null;
  const nacimiento = new Date(fechaISO);
  if (isNaN(nacimiento)) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const meses = hoy.getMonth() - nacimiento.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export function initials(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
