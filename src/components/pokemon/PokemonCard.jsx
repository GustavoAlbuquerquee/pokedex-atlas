import { memo } from "react";
import { STATS } from "../../domain/stats";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatBar from "../ui/StatBar";
import TypeBadge from "../ui/TypeBadge";
import "./PokemonCard.css";

/**
 * Card de um Pokémon na grade.
 *
 * Decisões de implementação que valem registro:
 * - O card inteiro é um `<button>`, para a área de clique ser o card e não só o
 *   nome. Favoritar e comparar ficam *fora* desse botão (um botão dentro de
 *   outro é HTML inválido e quebra o teclado), posicionados por cima.
 * - As duas cores de tipo alimentam a aura do fundo: um Pokémon de tipo duplo
 *   recebe um degradê entre as duas, o que dá identidade sem precisar de imagem.
 * - `memo`: favoritar um Pokémon redesenha só aquele card, não os 36 da tela.
 */
function PokemonCard({ pokemon, favorite, inCompare, onOpen, onToggleFavorite, onToggleCompare, index = 0 }) {
  const [primary, secondary] = pokemon.types;

  return (
    <li
      className="pokemon-card"
      style={{
        "--type-rgb": primary.rgb,
        "--type-2-rgb": (secondary ?? primary).rgb,
        "--enter-delay": `${Math.min(index, 11) * 35}ms`,
      }}
    >
      <button
        type="button"
        className="pokemon-card__surface"
        onClick={() => onOpen(pokemon.id)}
        aria-label={`Abrir detalhes de ${pokemon.name}, número ${pokemon.number}`}
      >
        <span className="pokemon-card__aura" aria-hidden="true" />
        <span className="pokemon-card__ring" aria-hidden="true" />

        <span className="pokemon-card__id numeric" aria-hidden="true">
          #{pokemon.number}
        </span>

        <span className="pokemon-card__art">
          <SmartImage
            sources={[pokemon.artwork, pokemon.sprite]}
            alt=""
            width={190}
            height={190}
            eager={index < 6}
          />
        </span>

        <span className="pokemon-card__identity">
          <span className="pokemon-card__name">{pokemon.name}</span>
          <span className="pokemon-card__types">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.id} type={type} size="sm" />
            ))}
          </span>
        </span>

        <span className="pokemon-card__stats">
          {STATS.map((stat) => (
            <StatBar
              key={stat.key}
              stat={stat}
              value={pokemon.stats[stat.key]}
              color={`rgb(${primary.rgb})`}
              variant="compact"
            />
          ))}
        </span>

        <span className="pokemon-card__total">
          <span className="pokemon-card__total-label">Total</span>
          <span className="pokemon-card__total-value numeric">{pokemon.total}</span>
        </span>
      </button>

      <span className="pokemon-card__tools">
        <FavoriteButton
          pokemonName={pokemon.name}
          active={favorite}
          onToggle={() => onToggleFavorite(pokemon.id)}
          size="sm"
        />
        <button
          type="button"
          className={`pokemon-card__compare${inCompare ? " is-active" : ""}`}
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

export default memo(PokemonCard);
