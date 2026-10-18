import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const montados = [];

export function renderUI(ui, { conApp = false, ruta = "/" } = {}) {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const root = createRoot(contenedor);
  const envuelto = conApp ? (
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  ) : (
    ui
  );
  act(() => {
    root.render(envuelto);
  });
  montados.push({ root, contenedor });
  return contenedor;
}

export function limpiar() {
  montados.splice(0).forEach(({ root, contenedor }) => {
    act(() => root.unmount());
    contenedor.remove();
  });
}

export function escribir(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  act(() => {
    setter.call(input, valor);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

export function salirDelCampo(elemento) {
  act(() => {
    elemento.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  });
}

export function enviar(formulario) {
  act(() => {
    formulario.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

export function presionarMouse(elemento) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  });
}

export function presionarTecla(tecla) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: tecla, bubbles: true }));
  });
}