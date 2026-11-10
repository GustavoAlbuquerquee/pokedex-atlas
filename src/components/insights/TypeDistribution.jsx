import "./insights.css";

/**
 * Distribuição dos Pokémon por tipo.
 *
 * Barras horizontais ordenadas da maior para a menor, cada uma na cor do tipo.
 * A escala é relativa ao tipo mais numeroso (e não ao total), senão todas as
 * barras ficariam curtas e indistinguíveis.
 *
 * Clicar em um tipo leva para a Pokédex já filtrada por ele — a estatística
 * vira ponto de partida de navegação, não só um gráfico para olhar.
 */
export default function TypeDistribution({ distribution, onSelectType }) {
  const max = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <ul className="type-dist">
      {distribution.map(({ type, count, share }) => (
        <li key={type.id}>
          <button
            type="button"
            className="type-dist__row"
            style={{
              "--type-rgb": type.rgb,
              "--bar-fill": `${(count / max) * 100}%`,
            }}
            onClick={() => onSelectType(type.name)}
            title={`Filtrar a Pokédex pelo tipo ${type.label}`}
          >
            <span className="type-dist__label">{type.label}</span>
            <span className="type-dist__track" aria-hidden="true">
              <span className="type-dist__fill" />
            </span>
            <span className="type-dist__count numeric">{count}</span>
            <span className="type-dist__share numeric">
              {(share * 100).toFixed(1).replace(".", ",")}%
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
