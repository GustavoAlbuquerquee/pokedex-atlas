import { useId } from "react";
import { SORT_FIELDS } from "../../services/pokedexQuery";
import Icon from "../ui/Icon";
import "./SortControl.css";

/**
 * Ordenação: campo + direção.
 *
 * O campo usa um `<select>` nativo de propósito. Um menu próprio ficaria mais
 * "desenhado", mas o nativo já vem com teclado, leitor de tela e, no celular,
 * a roleta do sistema — que é melhor que qualquer lista que eu desenhasse.
 * A estilização fica no invólucro, não no controle.
 *
 * As opções vêm de `SORT_FIELDS`, derivado dos seis atributos: acrescentar um
 * atributo ao domínio acrescenta a opção aqui sem tocar neste componente.
 */
export default function SortControl({ sort, onFieldChange, onToggleDirection }) {
  const id = useId();
  const ascending = sort.direction === "asc";

  return (
    <div className="sort-control">
      <label className="visually-hidden" htmlFor={id}>
        Ordenar por
      </label>

      <div className="sort-control__select">
        <Icon name="sliders" size={16} className="sort-control__icon" />
        <select
          id={id}
          value={sort.field}
          onChange={(event) => onFieldChange(event.target.value)}
        >
          {SORT_FIELDS.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={14} className="sort-control__caret" />
      </div>

      <button
        type="button"
        className="btn btn--icon sort-control__direction"
        onClick={onToggleDirection}
        aria-label={
          ascending
            ? "Ordem crescente. Clique para inverter para decrescente."
            : "Ordem decrescente. Clique para inverter para crescente."
        }
        title={ascending ? "Crescente" : "Decrescente"}
      >
        <Icon name={ascending ? "arrowUp" : "arrowDown"} size={16} />
      </button>
    </div>
  );
}
