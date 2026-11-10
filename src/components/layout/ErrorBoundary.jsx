import { Component } from "react";
import "./ErrorBoundary.css";

/**
 * Rede de segurança da aplicação.
 *
 * Um erro de renderização em React, sem tratamento, apaga a tela inteira e
 * deixa o usuário com uma página branca. Este limite captura o erro, mostra uma
 * mensagem com saída e preserva o detalhe técnico para quem for depurar.
 *
 * É o único componente de classe do projeto — `componentDidCatch` não tem
 * equivalente em hooks.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Em desenvolvimento o console é onde se procura primeiro.
    console.error("Erro na interface da Pokédex:", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="crash" role="alert">
        <div className="crash__panel">
          <h1 className="crash__title">Algo quebrou na interface</h1>
          <p className="crash__text">
            A Pokédex encontrou um erro inesperado ao desenhar esta tela. Os seus
            favoritos continuam salvos no navegador.
          </p>

          <pre className="crash__detail">{String(error?.message ?? error)}</pre>

          <div className="crash__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                window.location.hash = "#/pokedex";
                window.location.reload();
              }}
            >
              Recarregar a Pokédex
            </button>
          </div>
        </div>
      </div>
    );
  }
}
