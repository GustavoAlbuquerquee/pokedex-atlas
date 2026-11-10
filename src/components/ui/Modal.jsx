import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import "./Modal.css";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Sobreposição modal acessível, montada em portal no `document.body`.
 *
 * Cuida das quatro coisas que um modal precisa fazer e que quase sempre faltam:
 * trava a rolagem do fundo, prende o Tab dentro do painel, fecha no Escape e
 * devolve o foco ao elemento que o abriu. No celular ele vira uma folha que
 * sobe de baixo, que é o gesto esperado nesse tamanho de tela.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  size = "lg",
  closeLabel = "Fechar",
}) {
  const panelRef = useRef(null);
  const openerRef = useRef(null);

  // Guarda quem abriu o modal para devolver o foco ao fechar.
  useEffect(() => {
    if (open) openerRef.current = document.activeElement;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Compensa a largura da barra de rolagem para o fundo não "pular".
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector(FOCUSABLE);
    (firstFocusable ?? panel)?.focus({ preventScroll: true });

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal" role="presentation">
      <div className="modal__backdrop" onClick={onClose} />

      <div
        className={`modal__panel modal__panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={panelRef}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label={closeLabel}>
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
