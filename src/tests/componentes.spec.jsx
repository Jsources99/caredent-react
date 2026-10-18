import { Route, Routes } from "react-router-dom";
import Badge from "../components/Badge";
import ControlModal from "../components/ControlModal";
import Field from "../components/Field";
import Guard from "../components/Guard";
import Modal from "../components/Modal";
import { attemptLogin } from "../data/store";
import { useForm } from "../useForm";
import { enviar, escribir, limpiar, presionarMouse, presionarTecla, renderUI, salirDelCampo } from "./helpers";

function CampoNombre() {
  const form = useForm({ nombre: "" }, (v) => (v.nombre.trim() ? {} : { nombre: "Ingresa el nombre." }));
  return <Field form={form} name="nombre" label="Nombre" type="text" />;
}

describe("Componentes (props, eventos y DOM)", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    limpiar();
    localStorage.clear();
  });

  it("Badge muestra la etiqueta y la clase correspondientes al estado recibido por props", () => {
    const contenedor = renderUI(<Badge estado="vencido" />);
    const badge = contenedor.querySelector(".badge");

    expect(badge.textContent).toBe("Vencido");
    expect(badge.classList.contains("badge--danger")).toBeTrue();
  });

  it("Field muestra el error al salir de un campo vacío y lo quita cuando se corrige", () => {
    const contenedor = renderUI(<CampoNombre />);
    const input = contenedor.querySelector("input");
    expect(contenedor.querySelector(".field-error").textContent).toBe("");

    salirDelCampo(input);
    expect(contenedor.querySelector(".field-error").textContent).toBe("Ingresa el nombre.");
    expect(contenedor.querySelector(".field").classList.contains("has-error")).toBeTrue();

    escribir(input, "Ana");
    salirDelCampo(input);
    expect(contenedor.querySelector(".field-error").textContent).toBe("");
    expect(contenedor.querySelector(".field").classList.contains("has-error")).toBeFalse();
  });

  it("Modal se cierra con la tecla Escape y al hacer clic en el fondo, pero no al hacer clic dentro", () => {
    const alCerrar = jasmine.createSpy("alCerrar");
    const contenedor = renderUI(
      <Modal title="Aviso" onClose={alCerrar}>
        <p>Contenido</p>
      </Modal>
    );

    presionarTecla("Escape");
    expect(alCerrar).toHaveBeenCalledTimes(1);

    presionarMouse(contenedor.querySelector(".modal-backdrop"));
    expect(alCerrar).toHaveBeenCalledTimes(2);

    presionarMouse(contenedor.querySelector(".modal"));
    expect(alCerrar).toHaveBeenCalledTimes(2);
  });

  it("ControlModal valida los campos y solo llama a onSave cuando el formulario es correcto", () => {
    const alGuardar = jasmine.createSpy("alGuardar");
    const alCerrar = jasmine.createSpy("alCerrar");
    const pacientes = [{ id: 1, nombre: "Juan", apellidos: "Pérez Soto" }];
    const contenedor = renderUI(<ControlModal pacientes={pacientes} onSave={alGuardar} onClose={alCerrar} />);
    const formulario = contenedor.querySelector("form");

    enviar(formulario);
    expect(contenedor.querySelectorAll(".field.has-error").length).toBe(2);
    expect(alGuardar).not.toHaveBeenCalled();

    escribir(contenedor.querySelector("#fecha"), "2099-12-31");
    escribir(contenedor.querySelector("#motivo"), "  Revisión de ortodoncia  ");
    enviar(formulario);

    expect(alGuardar).toHaveBeenCalledOnceWith({ pacienteId: 1, fecha: "2099-12-31", motivo: "Revisión de ortodoncia" });
  });

  it("Guard envía al login si no hay sesión y redirige al inicio del rol si el rol no tiene permiso", () => {
    const rutas = (
      <Routes>
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/agenda" element={<p>Pantalla de agenda</p>} />
        <Route
          path="/privada"
          element={
            <Guard roles={["profesional"]}>
              <p>Contenido privado</p>
            </Guard>
          }
        />
      </Routes>
    );

    const sinSesion = renderUI(rutas, { conApp: true, ruta: "/privada" });
    expect(sinSesion.textContent).toContain("Pantalla de login");

    attemptLogin("recepcion", "recepcion123", "recepcionista");
    const conRolIncorrecto = renderUI(rutas, { conApp: true, ruta: "/privada" });
    expect(conRolIncorrecto.textContent).toContain("Pantalla de agenda");
    expect(conRolIncorrecto.textContent).not.toContain("Contenido privado");
  });
});