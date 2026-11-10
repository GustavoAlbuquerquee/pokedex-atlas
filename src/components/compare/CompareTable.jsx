import { STAT_MAX } from "../../config/appConfig";
import { comparePokemon } from "../../services/pokedexInsights";
import Icon from "../ui/Icon";
import "./CompareTable.css";

/**
 * Tabela de comparação entre dois Pokémon.
 *
 * As barras crescem do centro para fora, uma para cada lado: a diferença entre
 * os dois valores fica visível sem precisar ler os números. O lado vencedor de
 * cada atributo recebe destaque, e a diferença exata aparece no meio.
 *
 * É uma `<table>` de verdade porque é uma tabela de dados: isso dá cabeçalhos de
 * linha e coluna a quem usa leitor de tela, o que nenhuma pilha de `<div>` daria.
 */
export default function CompareTable({ a, b }) {
  const { rows, winsA, winsB, overall } = comparePokemon(a, b);
  const colorA = `rgb(${a.types[0].rgb})`;
  const colorB = `rgb(${b.types[0].rgb})`;

  return (
    <div className="compare-table">
      <div className="compare-table__summary">
        <div className={`compare-table__score${overall === "a" ? " is-winner" : ""}`}>
          <span className="compare-table__score-name">{a.name}</span>
          <span className="compare-table__score-value numeric">{winsA}</span>
        </div>

        <p className="compare-table__verdict">
          {overall === "tie" ? (
            <>
              <Icon name="scales" size={16} />
              Empate em atributos vencidos
            </>
          ) : (
            <>
              <Icon name="trophy" size={16} />
              {overall === "a" ? a.name : b.name} vence em mais atributos
            </>
          )}
        </p>

        <div className={`compare-table__score${overall === "b" ? " is-winner" : ""}`}>
          <span className="compare-table__score-value numeric">{winsB}</span>
          <span className="compare-table__score-name">{b.name}</span>
        </div>
      </div>

      <table>
        <caption className="visually-hidden">
          Comparação dos atributos de {a.name} e {b.name}
        </caption>
        <thead>
          <tr>
            <th scope="col">{a.name}</th>
            <th scope="col">Atributo</th>
            <th scope="col">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ field, valueA, valueB, diff, winner }) => {
            const isTotal = field.key === "total";
            const scale = isTotal ? STAT_MAX * 6 : STAT_MAX;
            return (
              <tr key={field.key} className={isTotal ? "is-total" : undefined}>
                <td className={`compare-table__side${winner === "a" ? " is-winner" : ""}`}>
                  <span className="compare-table__cell">
                    <span className="compare-table__value numeric">{valueA}</span>
                    <span
                      className="compare-table__bar compare-table__bar--left"
                      aria-hidden="true"
                      style={{
                        "--bar-fill": `${(valueA / scale) * 100}%`,
                        "--bar-color": colorA,
                      }}
                    >
                      <span className="compare-table__bar-fill" />
                    </span>
                  </span>
                </td>

                <th scope="row" className="compare-table__field">
                  <span className="compare-table__cell compare-table__cell--center">
                    <span className="compare-table__field-name">{field.label}</span>
                    <span className="compare-table__diff numeric">
                      {diff === 0
                        ? "igual"
                        : `${winner === "a" ? "◀" : "▶"} ${Math.abs(diff)}`}
                    </span>
                  </span>
                </th>

                <td className={`compare-table__side${winner === "b" ? " is-winner" : ""}`}>
                  <span className="compare-table__cell">
                    <span
                      className="compare-table__bar compare-table__bar--right"
                      aria-hidden="true"
                      style={{
                        "--bar-fill": `${(valueB / scale) * 100}%`,
                        "--bar-color": colorB,
                      }}
                    >
                      <span className="compare-table__bar-fill" />
                    </span>
                    <span className="compare-table__value numeric">{valueB}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
