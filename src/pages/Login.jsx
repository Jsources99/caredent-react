import { useState } from "react";
import { Navigate } from "react-router-dom";
import Field from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { HOME } from "../roles";
import { useForm } from "../useForm";

const ROLES = [
  ["administrador", "Administrador"],
  ["recepcionista", "Recepcionista"],
  ["profesional", "Profesional"],
];

export default function Login() {
  const { session, login } = useAuth();
  const [rol, setRol] = useState("administrador");
  const [error, setError] = useState("");
  const form = useForm({ usuario: "", clave: "" }, (v) => {
    const e = {};
    if (!v.usuario.trim()) e.usuario = "Ingresa tu usuario.";
    if (!v.clave) e.clave = "Ingresa tu contraseña.";
    return e;
  });

  if (session) return <Navigate to={HOME[session.rol]} replace />;

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.check()) {
      setError("Completa usuario y contraseña para continuar.");
      return;
    }
    const result = login(form.values.usuario, form.values.clave, rol);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="login-screen">
      <aside className="login-side">
        <div className="brand">
          <img alt="" className="brand__mark" src={`${import.meta.env.BASE_URL}logo.svg`} style={{ color: "#F4FAF8" }} />
          <span className="brand__word">Care<em>dent</em></span>
        </div>
        <div>
          <h1>Gestión y seguimiento clínico centrado en el paciente.</h1>
        </div>
      </aside>
      <main className="login-main">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <p className="lead">Selecciona tu rol e ingresa tus credenciales de demostración.</p>
          <div className="role-select">
            {ROLES.map(([value, label]) => (
              <button key={value} type="button" className={`role-chip${rol === value ? " is-active" : ""}`} onClick={() => setRol(value)}>
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={submit} noValidate>
            <Field form={form} name="usuario" label="Usuario" type="text" autoComplete="username" />
            <Field form={form} name="clave" label="Contraseña" type="password" autoComplete="current-password" />
            <button className="btn btn--primary btn--block" type="submit">Iniciar sesión</button>
            <div className={`login-msg${error ? " is-visible is-error" : ""}`}>{error}</div>
          </form>
          <div className="login-demo">
            Credenciales de demostración según rol:<br />
            Administrador: <code>admin</code> / <code>admin123</code><br />
            Recepcionista: <code>recepcion</code> / <code>recepcion123</code><br />
            Profesional: <code>profesional</code> / <code>profesional123</code>
          </div>
        </div>
      </main>
    </div>
  );
}
