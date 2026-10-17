import { ESTADOS } from "../utils";

export default function Badge({ estado }) {
  const e = ESTADOS[estado] || { label: estado, badge: "badge--muted" };
  return <span className={`badge ${e.badge}`}>{e.label}</span>;
}
