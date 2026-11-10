import Icon from "./Icon";
import "./SegmentedControl.css";

/**
 * Grupo de opções mutuamente exclusivas (densidade da grade, modo do filtro).
 *
 * Usa `role="radiogroup"` em vez de botões soltos para o leitor de tela anunciar
 * a opção escolhida dentro do grupo e para as setas do teclado navegarem entre
 * elas, como o usuário espera de um controle desse tipo.
 */
export default function SegmentedControl({ label, options, value, onChange, size = "md" }) {
  function onKeyDown(event) {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const next = (index + delta + options.length) % options.length;
    onChange(options[next].value);
  }

  return (
    <div
      className={`segmented segmented--${size}`}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="segmented__option"
            title={option.title ?? option.label}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <Icon name={option.icon} size={16} />}
            {option.label && <span className="segmented__text">{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
