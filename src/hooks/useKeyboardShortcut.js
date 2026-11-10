import { useEffect } from "react";

/**
 * Atalho de teclado global.
 *
 * Ignora o evento quando o foco está em um campo de texto, para não roubar a
 * digitação do usuário (exceto Escape, que deve funcionar em qualquer lugar).
 */
const TEXT_FIELDS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export default function useKeyboardShortcut(keys, handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    const wanted = Array.isArray(keys) ? keys : [keys];

    function onKeyDown(event) {
      if (!wanted.includes(event.key)) return;
      const target = event.target;
      const typing =
        TEXT_FIELDS.has(target?.tagName) || target?.isContentEditable === true;
      if (typing && event.key !== "Escape") return;
      handler(event);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keys, handler, enabled]);
}
