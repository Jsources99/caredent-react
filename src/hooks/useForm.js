import { useState } from "react";

// Hook para formularios controlados con validación.
//   initialValues: objeto con el valor inicial de cada campo
//   validators:    { campo: (valor) => "mensaje de error" | "" }
export default function useForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => (validators[name] ? validators[name](value) : "");

  // Cada tecla actualiza el estado. Si el campo ya tenía error, se revalida al escribir.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: validateField(name, value) } : prev));
  };

  // Al salir del campo (blur) se valida.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Antes de enviar: valida todos los campos y dice si el formulario es válido.
  const validateAll = () => {
    const nuevos = {};
    Object.keys(validators).forEach((name) => {
      nuevos[name] = validateField(name, values[name]);
    });
    setErrors(nuevos);
    return Object.values(nuevos).every((mensaje) => !mensaje);
  };

  const reset = (siguiente = initialValues) => {
    setValues(siguiente);
    setErrors({});
  };

  return { values, errors, handleChange, handleBlur, validateAll, reset };
}
