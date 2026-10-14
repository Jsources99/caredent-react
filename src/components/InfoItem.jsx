// Par "etiqueta / valor" usado en fichas e información de perfil.
export default function InfoItem({ label, children, className = "col-12 col-md-6" }) {
  return (
    <div className={className}>
      <div className="info-label">{label}</div>
      <div className="info-value">{children}</div>
    </div>
  );
}
