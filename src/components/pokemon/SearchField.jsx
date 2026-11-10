import { useId, useRef, useState } from "react";
import Icon from "../ui/Icon";
import "./SearchField.css";

/**
 * Campo de pesquisa por nome ou número.
 *
 * A lista é filtrada a cada tecla (sem botão "pesquisar"): o `onChange` sobe o
 * valor e a tela recalcula o resultado. O `Escape` limpa o campo — é o atalho
 * que o usuário tenta instintivamente.
 *
 * Quando o campo está vazio e existe histórico, aparece um painel com os últimos
 * termos pesquisados. O painel fecha quando o foco sai de todo o conjunto
 * (`focusout` no contêiner), o que funciona tanto com mouse quanto com Tab.
 */
export default function SearchField({
  value,
  onChange,
  history = [],
  onClearHistory,
  placeholder = "Pesquisar por nome ou número...",
}) {
  const inputId = useId();
  const listId = `${inputId}-history`;
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const showHistory = focused && value.trim() === "" && history.length > 0;

  return (
    <div
      className="search-field"
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <label className="visually-hidden" htmlFor={inputId}>
        Pesquisar Pokémon por nome ou número
      </label>

      <div className="search-field__box">
        <Icon name="search" size={18} className="search-field__icon" />

        <input
          id={inputId}
          ref={inputRef}
          type="search"
          className="search-field__input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          enterKeyHint="search"
          aria-describedby={showHistory ? listId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value !== "") {
              event.preventDefault();
              onChange("");
            }
          }}
        />

        {value !== "" && (
          <button
            type="button"
            className="search-field__clear"
            aria-label="Limpar pesquisa"
            title="Limpar pesquisa"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={15} />
          </button>
        )}
      </div>

      {showHistory && (
        <div className="search-field__history" id={listId}>
          <div className="search-field__history-head">
            <span className="eyebrow">Pesquisas recentes</span>
            <button
              type="button"
              className="search-field__history-clear"
              onClick={onClearHistory}
            >
              Limpar
            </button>
          </div>

          <ul className="search-field__history-list">
            {history.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  className="search-field__history-item"
                  onClick={() => {
                    onChange(term);
                    inputRef.current?.focus();
                  }}
                >
                  <Icon name="search" size={14} />
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
