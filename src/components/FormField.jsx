// Campo de formulario con etiqueta, mensaje de error y ayuda (clases de Bootstrap).
// Recibe el objeto que devuelve useForm() en la prop "form".
//   as: "input" (por defecto) | "select" | "textarea"
//   className: columnas de la grilla, p. ej. "col-12 col-md-6"
export default function FormField({
  form,
  name,
  label,
  id,
  as = "input",
  type = "text",
  hint,
  className = "col-12 col-md-6",
  children,
  ...rest
}) {
  const inputId = id ?? name;
  const error = form.errors[name];
  const comunes = {
    id: inputId,
    name,
    value: form.values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
    "aria-invalid": error ? "true" : undefined,
    ...rest,
  };
  const claseControl = `${as === "select" ? "form-select" : "form-control"}${error ? " is-invalid" : ""}`;

  let control;
  if (as === "select") control = <select className={claseControl} {...comunes}>{children}</select>;
  else if (as === "textarea") control = <textarea className={claseControl} rows={3} {...comunes} />;
  else control = <input className={claseControl} type={type} {...comunes} />;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      {control}
      {error && <div className="invalid-feedback">{error}</div>}
      {hint && !error && <div className="form-text">{hint}</div>}
    </div>
  );
}
