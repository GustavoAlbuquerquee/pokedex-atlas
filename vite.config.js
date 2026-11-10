import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Configuração do Vite.
 *
 * `base: "./"` gera caminhos relativos no build, para a aplicação funcionar
 * tanto na raiz de um domínio quanto em subpasta (GitHub Pages) — e também
 * aberta direto do disco, já que as rotas usam hash.
 *
 * Não há back-end: o `pokedex-data.json` é empacotado no bundle pelo Vite e as
 * imagens são buscadas por URL direta, sem chamada de API.
 */
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
