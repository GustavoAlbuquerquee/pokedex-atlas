import { useCallback, useEffect } from "react";
import { STORAGE_KEYS } from "../config/appConfig";
import useLocalStorage, { TEXT_CODEC } from "./useLocalStorage";

/**
 * Tema claro/escuro com preferência persistida.
 *
 * O index.html já aplica o tema certo em `data-theme` antes do React montar
 * (para a página não "piscar" no carregamento). Aqui o estado inicial é lido do
 * próprio atributo, o que mantém HTML e React na mesma verdade.
 */
function currentFromDocument() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function useTheme() {
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.theme,
    currentFromDocument(),
    TEXT_CODEC,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f3f5fa" : "#030407");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme, isDark: theme === "dark" };
}
