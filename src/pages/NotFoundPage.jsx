import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center p-4 text-center">
      <div>
        <h1 className="h3 fw-semibold">Página no encontrada</h1>
        <p className="text-muted">La dirección que buscas no existe en Caredent.</p>
        <Link className="btn btn-primary" to="/dashboard">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
