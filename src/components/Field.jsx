// Campo de formulario con etiqueta, error y ayuda. `as` puede ser input, select o textarea.
export default function Field({ form, name, label, as: Tag = "input", hint, full, children, ...rest }) {
  const error = form.errors[name];
  return (
    <div className={`field${full ? " field--full" : ""}${error ? " has-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <Tag id={name} name={name} value={form.values[name]} onChange={form.set} onBlur={form.blur} {...rest}>
        {children}
      </Tag>
      <div className="field-error">{error}</div>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
