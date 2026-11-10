import Icon from "../ui/Icon";
import SegmentedControl from "../ui/SegmentedControl";
import "./TypeFilterBar.css";

const MODE_OPTIONS = [
  { value: "all", label: "E", title: "Exige todos os tipos marcados" },
  { value: "any", label: "OU", title: "Aceita qualquer um dos tipos marcados" },
];

/**
 * Filtro por tipo.
 *
 * Uma chip por tipo presente no `pokedex-data.json` — a lista nunca é escrita à
 * mão, vem do próprio arquivo, com o contador de quantos Pokémon da lista atual
 * têm aquele tipo. Clicar de novo na chip tira o filtro.
 *
 * Como vários tipos podem ficar marcados ao mesmo tempo, o controle E/OU
 * aparece a partir do segundo tipo: "Planta E Venenoso" (os dois) é uma pergunta
 * diferente de "Planta OU Venenoso" (qualquer um deles). Ele só surge quando faz
 * diferença, para não poluir o caso comum de um tipo só.
 *
 * Chips com contador zero continuam visíveis, porém desativadas: esconder faria
 * a barra pular de tamanho a cada letra digitada na pesquisa.
 */
export default function TypeFilterBar({
  types,
  counts,
  total,
  selected,
  mode,
  onToggle,
  onClear,
  onModeChange,
}) {
  return (
    <section className="type-filter" aria-label="Filtro por tipo">
      <div className="type-filter__head">
        <span className="eyebrow">Tipos</span>

        {selected.length > 1 && (
          <SegmentedControl
            label="Combinação dos tipos"
            size="sm"
            options={MODE_OPTIONS}
            value={mode}
            onChange={onModeChange}
          />
        )}

        {selected.length > 0 && (
          <button type="button" className="type-filter__reset" onClick={onClear}>
            <Icon name="close" size={13} />
            Limpar {selected.length === 1 ? "tipo" : "tipos"}
          </button>
        )}
      </div>

      <div className="type-filter__chips">
        <button
          type="button"
          className="type-chip type-chip--all"
          aria-pressed={selected.length === 0}
          onClick={onClear}
        >
          <Icon name="layers" size={14} />
          Todos
          <span className="type-chip__count numeric">{total}</span>
        </button>

        {types.map((type) => {
          const count = counts.get(type.name) ?? 0;
          const active = selected.includes(type.name);
          return (
            <button
              key={type.id}
              type="button"
              className="type-chip"
              style={{ "--type-rgb": type.rgb, "--type-ink": type.ink }}
              aria-pressed={active}
              disabled={count === 0 && !active}
              onClick={() => onToggle(type.name)}
            >
              <span className="type-chip__dot" aria-hidden="true" />
              {type.label}
              <span className="type-chip__count numeric">{count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
