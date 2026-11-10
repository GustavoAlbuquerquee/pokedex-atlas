/**
 * Ponto de entrada.
 *
 * A ordem dos imports de CSS é intencional: tokens e base primeiro, depois os
 * estilos compartilhados de botão e ícone e, só então, o App — que arrasta
 * consigo o CSS de cada componente. Como o bundler preserva essa ordem, as
 * regras mais específicas entram depois das genéricas na cascata.
 */
import "./styles/tokens.css";
import "./styles/base.css";
import "./components/ui/Button.css";
import "./components/ui/Icon.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
