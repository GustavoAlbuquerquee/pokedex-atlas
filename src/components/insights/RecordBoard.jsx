import SmartImage from "../ui/SmartImage";
import "./insights.css";

/**
 * Recordistas: quem tem o maior valor em cada atributo e no total.
 *
 * Cada item abre os detalhes daquele Pokémon, então a tabela de recordes também
 * funciona como atalho de navegação.
 */
export default function RecordBoard({ records, onOpenPokemon }) {
  return (
    <ul className="records">
      {records.map(({ field, pokemon, value }) => (
        <li key={field.key}>
          <button
            type="button"
            className="records__item"
            style={{ "--type-rgb": pokemon.types[0].rgb }}
            onClick={() => onOpenPokemon(pokemon.id)}
          >
            <span className="records__field">{field.label}</span>

            <span className="records__art">
              <SmartImage sources={[pokemon.sprite]} alt="" width={52} height={52} pixelated />
            </span>

            <span className="records__name">{pokemon.name}</span>
            <span className="records__value numeric">{value}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
