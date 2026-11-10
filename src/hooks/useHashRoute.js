import { useCallback, useEffect, useState } from "react";

/**
 * Roteamento próprio por hash (#/pokedex, #/treinadores/3, #/pokemon/25).
 *
 * Usar o hash em vez de uma biblioteca de rotas tem duas vantagens aqui: não
 * acrescenta dependência para três níveis de navegação e o build funciona ao ser
 * aberto direto do disco ou em subpasta (GitHub Pages), sem servidor reescrevendo
 * caminhos. O estado da tela passa a ser compartilhável e sobrevive ao recarregar.
 */
function parse(hash) {
  const clean = hash.replace(/^#\/?/, "").split("?")[0];
  const segments = clean.split("/").filter(Boolean).map(decodeURIComponent);
  return {
    view: segments[0] ?? "pokedex",
    param: segments[1] ?? null,
    segments,
  };
}

export default function useHashRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  /** Troca a rota criando uma entrada no histórico (o "voltar" do navegador funciona). */
  const navigate = useCallback((path) => {
    const next = `#/${String(path).replace(/^#?\/?/, "")}`;
    if (window.location.hash !== next) window.location.hash = next;
  }, []);

  /** Troca a rota sem empilhar histórico — usado ao fechar os detalhes. */
  const replace = useCallback((path) => {
    const next = `#/${String(path).replace(/^#?\/?/, "")}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
    setRoute(parse(next));
  }, []);

  return { route, navigate, replace };
}
