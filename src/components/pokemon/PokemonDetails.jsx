import { useId, useMemo } from "react";
import { STAT_MAX, TOTAL_POKEMON } from "../../config/appConfig";
import { STATS } from "../../domain/stats";
import useKeyboardShortcut from "../../hooks/useKeyboardShortcut";
import {
  rankOf,
  sameTypeAs,
  strongestStat,
  weakestStat,
} from "../../services/pokedexInsights";
import { trainersOf } from "../../services/pokedexRepository";
import { decimal, ordinal, plural } from "../../utils/text";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatBar from "../ui/StatBar";
import "./PokemonDetails.css";

const RELATED_LIMIT = 8;

/**
 * Painel de detalhes de um Pokémon.
 *
 * Mostra tudo o que a atividade pede (identificação, imagem, tipos e os seis
 * atributos com barras) e as informações adicionais que *já existem* nos dados:
 * os treinadores que têm aquele Pokémon, outros Pokémon que compartilham tipo e
 * a posição de cada atributo entre os 151. Nada aqui é inventado — tudo é
 * calculado a partir do `pokedex-data.json`.
 *
 * `order` é a lista de IDs na ordem em que o usuário está vendo (filtrada e
 * ordenada), então "anterior/próximo" segue exatamente o que está na tela, e
 * não a ordem numérica. As setas do teclado fazem a mesma navegação.
 */
export default function PokemonDetails({
  pokemon,
  order,
  favorite,
  inCompare,
  onToggleFavorite,
  onToggleCompare,
  onNavigate,
  onOpenPokemon,
  onOpenTrainer,
  onFilterType,
  titleId,
}) {
  const position = order.indexOf(pokemon.id);
  const previousId = position > 0 ? order[position - 1] : null;
  const nextId = position >= 0 && position < order.length - 1 ? order[position + 1] : null;

  const headingId = useId();
  const id = titleId ?? headingId;

  const trainers = useMemo(() => trainersOf(pokemon.id), [pokemon.id]);
  const related = useMemo(() => sameTypeAs(pokemon, RELATED_LIMIT), [pokemon]);
  const relatedTotal = useMemo(() => sameTypeAs(pokemon).length, [pokemon]);
  const best = useMemo(() => strongestStat(pokemon), [pokemon]);
  const worst = useMemo(() => weakestStat(pokemon), [pokemon]);
  const totalRank = useMemo(() => rankOf(pokemon, "total"), [pokemon]);

  useKeyboardShortcut("ArrowLeft", () => previousId && onNavigate(previousId));
  useKeyboardShortcut("ArrowRight", () => nextId && onNavigate(nextId));

  const [primary, secondary] = pokemon.types;

  return (
    <article
      className="details"
      style={{
        "--type-rgb": primary.rgb,
        "--type-2-rgb": (secondary ?? primary).rgb,
      }}
    >
      {/* ---------------- Lado visual ---------------- */}
      <div className="details__hero">
        <span className="details__aura" aria-hidden="true" />

        <p className="details__position numeric" aria-live="polite">
          {position >= 0 ? `${position + 1} / ${order.length}` : `#${pokemon.number}`}
        </p>

        <span className="details__number numeric" aria-hidden="true">
          #{pokemon.number}
        </span>

        <div className="details__art">
          <SmartImage
            sources={[pokemon.artwork, pokemon.sprite]}
            alt={`Arte oficial de ${pokemon.name}`}
            width={340}
            height={340}
            eager
          />
        </div>

        <h2 className="details__name" id={id}>
          {pokemon.name}
        </h2>

        <div className="details__types">
          {pokemon.types.map((type) => (
            <button
              key={type.id}
              type="button"
              className="details__type-link"
              style={{ "--type-chip-rgb": type.rgb, "--type-chip-ink": type.ink }}
              onClick={() => onFilterType(type.name)}
              title={`Ver todos os Pokémon do tipo ${type.label}`}
            >
              <span className="details__type-dot" aria-hidden="true" />
              {type.label}
            </button>
          ))}
        </div>

        <div className="details__actions">
          <FavoriteButton
            pokemonName={pokemon.name}
            active={favorite}
            onToggle={() => onToggleFavorite(pokemon.id)}
          />
          <button
            type="button"
            className={`btn btn--sm${inCompare ? " btn--primary" : " btn--ghost"}`}
            aria-pressed={inCompare}
            onClick={() => onToggleCompare(pokemon.id)}
          >
            <Icon name={inCompare ? "check" : "scales"} size={15} />
            {inCompare ? "Na comparação" : "Comparar"}
          </button>
        </div>

        <nav className="details__nav" aria-label="Navegar entre Pokémon">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={!previousId}
            onClick={() => previousId && onNavigate(previousId)}
          >
            <Icon name="chevronLeft" size={16} />
            Anterior
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={!nextId}
            onClick={() => nextId && onNavigate(nextId)}
          >
            Próximo
            <Icon name="chevronRight" size={16} />
          </button>
        </nav>
      </div>

      {/* ---------------- Lado dos dados ---------------- */}
      <div className="details__body">
        <section className="details__highlights" aria-label="Destaques">
          <div className="highlight">
            <span className="highlight__label">Total de atributos</span>
            <span className="highlight__value numeric">{pokemon.total}</span>
            <span className="highlight__note">
              {ordinal(totalRank)} entre os {TOTAL_POKEMON}
            </span>
          </div>

          <div className="highlight">
            <span className="highlight__label">Ponto forte</span>
            <span className="highlight__value">
              {best.label} <span className="numeric">{best.value}</span>
            </span>
            <span className="highlight__note">{ordinal(best.rank)} maior valor</span>
          </div>

          <div className="highlight">
            <span className="highlight__label">Ponto fraco</span>
            <span className="highlight__value">
              {worst.label} <span className="numeric">{worst.value}</span>
            </span>
            <span className="highlight__note">{ordinal(worst.rank)} maior valor</span>
          </div>

          <div className="highlight">
            <span className="highlight__label">Média dos atributos</span>
            <span className="highlight__value numeric">{decimal(pokemon.total / 6)}</span>
            <span className="highlight__note">
              {pokemon.types.length > 1 ? "Tipo duplo" : "Tipo único"}
            </span>
          </div>
        </section>

        <section className="details__section" aria-labelledby={`${id}-stats`}>
          <h3 className="details__section-title" id={`${id}-stats`}>
            <Icon name="chart" size={16} />
            Atributos base
          </h3>

          <div className="details__stats">
            {STATS.map((stat, index) => (
              <div key={stat.key} className="details__stat-row">
                <StatBar
                  stat={stat}
                  value={pokemon.stats[stat.key]}
                  color={`rgb(${primary.rgb})`}
                  variant="full"
                  delay={index * 55}
                  highlight={stat.key === best.key}
                  showIcon
                />
                <span
                  className="details__stat-rank numeric"
                  title={`Posição deste atributo entre os ${TOTAL_POKEMON} Pokémon`}
                >
                  {ordinal(rankOf(pokemon, stat.key))}
                </span>
              </div>
            ))}
          </div>

          <p className="details__scale">
            As barras usam a escala de 0 a {STAT_MAX}, o maior valor possível de um
            atributo base — assim dois Pokémon podem ser comparados a olho.
          </p>
        </section>

        <section className="details__section" aria-labelledby={`${id}-trainers`}>
          <h3 className="details__section-title" id={`${id}-trainers`}>
            <Icon name="users" size={16} />
            Treinadores
          </h3>

          {trainers.length === 0 ? (
            <p className="details__muted">
              Nenhum treinador do arquivo de dados tem {pokemon.name} no time.
            </p>
          ) : (
            <ul className="details__trainers">
              {trainers.map((trainer) => (
                <li key={trainer.id}>
                  <button
                    type="button"
                    className="details__trainer"
                    onClick={() => onOpenTrainer(trainer.id)}
                  >
                    <SmartImage
                      sources={trainer.sprites}
                      alt=""
                      width={40}
                      height={40}
                      pixelated
                      fallback={
                        <span className="details__trainer-initials" aria-hidden="true">
                          {trainer.initials}
                        </span>
                      }
                    />
                    <span className="details__trainer-text">
                      <span className="details__trainer-name">{trainer.name}</span>
                      <span className="details__trainer-meta">
                        {plural(trainer.badges, "insígnia")}
                      </span>
                    </span>
                    <Icon name="arrowRight" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {related.length > 0 && (
          <section className="details__section" aria-labelledby={`${id}-related`}>
            <h3 className="details__section-title" id={`${id}-related`}>
              <Icon name="layers" size={16} />
              Compartilham tipo
              <span className="details__section-count numeric">{relatedTotal}</span>
            </h3>

            <ul className="details__related">
              {related.map((other) => (
                <li key={other.id}>
                  <button
                    type="button"
                    className="details__related-item"
                    style={{ "--type-rgb": other.types[0].rgb }}
                    onClick={() => onOpenPokemon(other.id)}
                  >
                    <SmartImage
                      sources={[other.sprite]}
                      alt=""
                      width={44}
                      height={44}
                      pixelated
                    />
                    <span className="details__related-name">{other.name}</span>
                    <span className="details__related-id numeric">#{other.number}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn--ghost btn--sm details__related-all"
              onClick={() => onFilterType(primary.name)}
            >
              Filtrar a Pokédex pelo tipo {primary.label}
              <Icon name="arrowRight" size={15} />
            </button>
          </section>
        )}
      </div>
    </article>
  );
}
