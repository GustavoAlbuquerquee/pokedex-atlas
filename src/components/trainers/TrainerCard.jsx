import { BADGE_SLOTS } from "../../domain/trainer";
import { plural } from "../../utils/text";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import "./TrainerCard.css";

/**
 * Card de um treinador: imagem, nome, insígnias e o time completo.
 *
 * Os relacionamentos vêm prontos do `pokedex-data.json` (campo `pokemonIds`) —
 * nada é inferido. A ordem e as repetições do arquivo são preservadas: o Koga
 * realmente tem três Venonat, então aparecem três, e a `key` da lista usa a
 * posição, porque o ID se repete.
 *
 * Clicar em um Pokémon do time abre os detalhes navegando *dentro do time*: as
 * setas "anterior/próximo" andam pelos Pokémon daquele treinador, não pela
 * Pokédex inteira.
 */
export default function TrainerCard({ trainer, highlighted, onOpenPokemon }) {
  const titleId = `trainer-${trainer.id}-name`;
  const slots = Math.max(BADGE_SLOTS, trainer.badges);

  return (
    <li>
      <article
        id={`trainer-${trainer.id}`}
        className={`trainer-card${highlighted ? " is-highlighted" : ""}`}
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="trainer-card__head">
          <span className="trainer-card__avatar">
            <SmartImage
              sources={trainer.sprites}
              alt={`Imagem de ${trainer.name}`}
              width={64}
              height={64}
              pixelated
              fallback={
                <span className="trainer-card__initials" aria-hidden="true">
                  {trainer.initials}
                </span>
              }
            />
          </span>

          <div className="trainer-card__title">
            <h3 className="trainer-card__name" id={titleId}>
              {trainer.name}
            </h3>
            <p className="trainer-card__meta">
              {plural(trainer.badges, "insígnia")} · {plural(trainer.teamSize, "Pokémon", "Pokémon")}
            </p>
          </div>

          <span className="trainer-card__power" title="Soma dos atributos do time">
            <span className="trainer-card__power-label">Força do time</span>
            <span className="trainer-card__power-value numeric">{trainer.teamPower}</span>
          </span>
        </header>

        <div className="trainer-card__badges">
          <span className="visually-hidden">
            {plural(trainer.badges, "insígnia")} de {slots}
          </span>
          {Array.from({ length: slots }, (_, index) => (
            <span
              key={index}
              className={`trainer-card__pip${index < trainer.badges ? " is-on" : ""}`}
              aria-hidden="true"
            >
              <Icon name="badge" size={13} />
            </span>
          ))}
        </div>

        <ul className="trainer-card__team" aria-label={`Time de ${trainer.name}`}>
          {trainer.pokemon.map((pokemon, index) => (
            <li key={`${pokemon.id}-${index}`}>
              <button
                type="button"
                className="team-slot"
                style={{ "--type-rgb": pokemon.types[0].rgb }}
                onClick={() => onOpenPokemon(pokemon.id, trainer.pokemonIds)}
                aria-label={`Abrir ${pokemon.name}, do time de ${trainer.name}`}
              >
                <span className="team-slot__art">
                  <SmartImage
                    sources={[pokemon.sprite, pokemon.artwork]}
                    alt=""
                    width={56}
                    height={56}
                    pixelated
                  />
                </span>
                <span className="team-slot__name">{pokemon.name}</span>
                <span className="team-slot__id numeric">#{pokemon.number}</span>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}
