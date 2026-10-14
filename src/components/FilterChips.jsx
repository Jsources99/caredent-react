// Botones de filtro. opciones: [{ value, label }]. El padre guarda el valor elegido.
export default function FilterChips({ opciones, valor, onChange }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Filtrar por estado">
      {opciones.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`chip${valor === o.value ? " is-active" : ""}`}
          aria-pressed={valor === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
