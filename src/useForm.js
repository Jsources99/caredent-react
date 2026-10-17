import { useState } from "react";

// `validate(values)` devuelve un objeto { campo: "mensaje" } solo con los campos inválidos.
export function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const blur = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  };
  const check = () => {
    const errs = validate(values);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const reset = () => {
    setValues(initial);
    setErrors({});
  };

  return { values, setValues, errors, set, blur, check, reset };
}
