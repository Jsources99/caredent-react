// Validadores reutilizables. Cada uno recibe un mensaje de error y devuelve
// una función: (valor) => "" si es válido, o el mensaje si no lo es.

const texto = (v) => String(v ?? "").trim();

export const required = (msg) => (v) => (texto(v) ? "" : msg);

export const email = (msg) => (v) =>
  !texto(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto(v)) ? "" : msg;

// Formato chileno: 12.345.678-9
export const rut = (msg) => (v) =>
  !texto(v) || /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(texto(v)) ? "" : msg;

export const phone = (msg) => (v) =>
  !texto(v) || /^\+?\d[\d\s]{6,}$/.test(texto(v)) ? "" : msg;

// Combina varios validadores: devuelve el primer error que encuentre.
export const compose =
  (...validadores) =>
  (v) => {
    for (const validar of validadores) {
      const error = validar(v);
      if (error) return error;
    }
    return "";
  };
