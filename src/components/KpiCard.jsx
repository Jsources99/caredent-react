// Tarjeta con un indicador. Todo llega por props.
export default function KpiCard({ label, value, sub, warn = false, small = false }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="kpi-label">{label}</div>
        <div className={`kpi-value${small ? " kpi-value-sm" : ""}`}>{value}</div>
        <div className={`kpi-sub${warn ? " is-warn" : ""}`}>{sub}</div>
      </div>
    </div>
  );
}
