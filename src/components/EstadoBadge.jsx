import { ESTADOS } from "../utils/format.js";

// Etiqueta de color según el estado. Recibe el estado por props.
export default function EstadoBadge({ estado }) {
  const e = ESTADOS[estado] || { label: estado, clase: "estado-muted" };
  return <span className={`badge rounded-pill estado-badge ${e.clase}`}>{e.label}</span>;
}
