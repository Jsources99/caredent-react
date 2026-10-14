import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useForm from "../hooks/useForm.js";
import { required } from "../utils/validators.js";

const ROLES = [
  { value: "administrador", label: "Administrador" },
  { value: "recepcionista", label: "Recepcionista" },
  { value: "profesional", label: "Profesional" },
];

export default function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [rol, setRol] = useState("administrador");
  const [error, setError] = useState("");
  const form = useForm(
    { usuario: "", clave: "" },
    { usuario: required("Ingresa tu usuario."), clave: required("Ingresa tu contraseña.") }
  );

  // Si ya hay sesión, no tiene sentido mostrar el login.
  if (session) return <Navigate to="/dashboard" replace />;

  const enviar = (e) => {
    e.preventDefault();
    if (!form.validateAll()) {
      setError("Completa usuario y contraseña para continuar.");
      return;
    }
    const resultado = login(form.values.usuario, form.values.clave, rol);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="row g-0 min-vh-100 mx-0">
      <aside className="login-side col-lg-6 d-none d-lg-flex flex-column justify-content-between">
        <Brand />
        <h1>Gestión y seguimiento clínico centrado en el paciente.</h1>
      </aside>

      <main className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
        <div className="login-card w-100">
          <div className="d-lg-none mb-4">
            <Brand className="brand-light" />
          </div>
          <h2 className="h4 fw-semibold mb-1">Iniciar sesión</h2>
          <p className="text-muted small mb-4">Selecciona tu rol e ingresa tus credenciales de demostración.</p>

          <div className="d-flex gap-2 mb-4" role="group" aria-label="Rol">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`role-chip${rol === r.value ? " is-active" : ""}`}
                aria-pressed={rol === r.value}
                onClick={() => setRol(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={enviar} noValidate>
            <FormField form={form} name="usuario" label="Usuario" className="mb-3" autoComplete="username" />
            <FormField
              form={form}
              name="clave"
              label="Contraseña"
              type="password"
              className="mb-3"
              autoComplete="current-password"
            />
            <button className="btn btn-primary w-100" type="submit">
              Iniciar sesión
            </button>
            {error && (
              <div className="alert alert-danger py-2 small mt-3 mb-0" role="alert">
                {error}
              </div>
            )}
          </form>

          <div className="login-demo">
            Credenciales de demostración según rol:
            <br />
            Administrador: <code>admin</code> / <code>admin123</code>
            <br />
            Recepcionista: <code>recepcion</code> / <code>recepcion123</code>
            <br />
            Profesional: <code>profesional</code> / <code>profesional123</code>
          </div>
        </div>
      </main>
    </div>
  );
}
