import { memo } from "react";
import { STAT_MAX } from "../../config/appConfig";
import { STATS } from "../../domain/stats";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import TypeBadge from "../ui/TypeBadge";
import "./PokemonRow.css";

/**
 * O mesmo Pokémon em formato de linha, para a visão de lista.
 *
 * Existe porque comparar números entre muitos Pokémon é mais fácil em colunas
 * alinhadas do que em cards: aqui os seis atributos ficam em colunas fixas, com
 * uma microbarra sob cada número. Em telas estreitas as colunas viram uma faixa
 * com rolagem horizontal própria, em vez de encavalar.
 */
function PokemonRow({
  pokemon,
  favorite,
  inCompare,
  onOpen,
  onToggleFavorite,
  onToggleCompare,
  index = 0,
}) {
  const [primary, secondary] = pokemon.types;

  return (
    <li
      className="pokemon-row"
      style={{
        "--type-rgb": primary.rgb,
        "--type-2-rgb": (secondary ?? primary).rgb,
        "--enter-delay": `${Math.min(index, 14) * 22}ms`,
      }}
    >
      <button
        type="button"
        className="pokemon-row__surface"
        onClick={() => onOpen(pokemon.id)}
        aria-label={`Abrir detalhes de ${pokemon.name}, número ${pokemon.number}`}
      >
        <span className="pokemon-row__thumb">
          <SmartImage
            sources={[pokemon.sprite, pokemon.artwork]}
            alt=""
            width={72}
            height={72}
            pixelated
            eager={index < 10}
          />
        </span>

        <span className="pokemon-row__identity">
          <span className="pokemon-row__id numeric">#{pokemon.number}</span>
          <span className="pokemon-row__name">{pokemon.name}</span>
          <span className="pokemon-row__types">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.id} type={type} size="sm" />
            ))}
          </span>
        </span>

        <span className="pokemon-row__stats">
          {STATS.map((stat) => {
            const value = pokemon.stats[stat.key];
            return (
              <span key={stat.key} className="pokemon-row__stat">
                <span className="pokemon-row__stat-label" aria-hidden="true">
                  {stat.short}
                </span>
                <span className="pokemon-row__stat-value numeric">
                  <span className="visually-hidden">{stat.label}: </span>
                  {value}
                </span>
                <span
                  className="pokemon-row__stat-track"
                  aria-hidden="true"
                  style={{ "--stat-fill": `${Math.min(100, (value / STAT_MAX) * 100)}%` }}
                >
                  <span className="pokemon-row__stat-fill" />
                </span>
              </span>
            );
          })}

          <span className="pokemon-row__stat pokemon-row__stat--total">
            <span className="pokemon-row__stat-label" aria-hidden="true">
              TOT
            </span>
            <span className="pokemon-row__stat-value numeric">
              <span className="visually-hidden">Total de atributos: </span>
              {pokemon.total}
            </span>
          </span>
        </span>
      </button>

      <span className="pokemon-row__tools">
        <FavoriteButton
          pokemonName={pokemon.name}
          active={favorite}
          onToggle={() => onToggleFavorite(pokemon.id)}
          size="sm"
        />
        <button
          type="button"
          className={`pokemon-row__compare${inCompare ? " is-active" : ""}`}
          aria-pressed={inCompare}
          aria-label={
            inCompare
              ? `Remover ${pokemon.name} da comparação`
              : `Adicionar ${pokemon.name} à comparação`
          }
          title={inCompare ? "Na comparação" : "Comparar"}
          onClick={() => onToggleCompare(pokemon.id)}
        >
          <Icon name={inCompare ? "check" : "scales"} size={15} />
        </button>
      </span>
    </li>
  );
}

export default memo(PokemonRow);
