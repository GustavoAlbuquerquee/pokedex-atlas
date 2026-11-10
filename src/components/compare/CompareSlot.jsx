import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import TypeBadge from "../ui/TypeBadge";
import "./CompareSlot.css";

/**
 * Um dos dois lados da comparação.
 *
 * Vazio, é um alvo convidativo (não uma caixa cinza com "selecione"): mostra o
 * que fazer e abre o seletor. Preenchido, mostra a arte, a identificação e o
 * total, com as ações de trocar e remover.
 */
export default function CompareSlot({ pokemon, side, winner, onPick, onClear }) {
  const label = side === "a" ? "Primeiro Pokémon" : "Segundo Pokémon";

  if (!pokemon) {
    return (
      <div className="compare-slot compare-slot--empty">
        <span className="eyebrow">{label}</span>
        <button type="button" className="compare-slot__pick" onClick={onPick}>
          <span className="compare-slot__pick-glyph" aria-hidden="true">
            <Icon name="plus" size={24} />
          </span>
          Escolher Pokémon
        </button>
      </div>
    );
  }

  const [primary, secondary] = pokemon.types;

  return (
    <div
      className={`compare-slot${winner ? " is-winner" : ""}`}
      style={{
        "--type-rgb": primary.rgb,
        "--type-2-rgb": (secondary ?? primary).rgb,
      }}
    >
      <span className="compare-slot__aura" aria-hidden="true" />

      <header className="compare-slot__head">
        <span className="eyebrow">{label}</span>
        {winner && (
          <span className="compare-slot__crown">
            <Icon name="trophy" size={13} />
            Vantagem
          </span>
        )}
      </header>

      <div className="compare-slot__art">
        <SmartImage
          sources={[pokemon.artwork, pokemon.sprite]}
          alt={`Arte de ${pokemon.name}`}
          width={200}
          height={200}
          eager
        />
      </div>

      <p className="compare-slot__id numeric">#{pokemon.number}</p>
      <h3 className="compare-slot__name">{pokemon.name}</h3>

      <div className="compare-slot__types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type.id} type={type} size="sm" />
        ))}
      </div>

      <p className="compare-slot__total">
        Total <strong className="numeric">{pokemon.total}</strong>
      </p>

      <div className="compare-slot__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onPick}>
          <Icon name="search" size={14} />
          Trocar
        </button>
        <button type="button" className="btn btn--quiet btn--sm" onClick={onClear}>
          <Icon name="close" size={14} />
          Remover
        </button>
      </div>
    </div>
  );
}
