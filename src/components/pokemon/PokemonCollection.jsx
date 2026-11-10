import useProgressiveList from "../../hooks/useProgressiveList";
import Icon from "../ui/Icon";
import PokemonCard from "./PokemonCard";
import PokemonRow from "./PokemonRow";
import "./PokemonCollection.css";

/**
 * A lista de Pokémon renderizada com `map()`, em grade ou em linhas.
 *
 * Centraliza duas responsabilidades que não pertencem ao card: escolher a forma
 * de apresentação (`view`) e o carregamento progressivo. A sentinela invisível
 * no fim cresce a fatia quando entra na tela — e o botão "Carregar mais" existe
 * para quem navega por teclado ou tem o observador indisponível.
 *
 * Quando não há resultado, renderiza o estado vazio recebido por prop: assim a
 * mensagem pode ser específica da tela (Pokédex, Favoritos) sem este componente
 * precisar conhecer nenhuma delas.
 */
export default function PokemonCollection({
  pokemons,
  view = "grid",
  favoriteIds,
  compareIds,
  onOpen,
  onToggleFavorite,
  onToggleCompare,
  emptyState,
  label = "Pokémon",
}) {
  const { visible, hasMore, loadMore, sentinelRef, shown, total } = useProgressiveList(pokemons);

  if (pokemons.length === 0) return emptyState ?? null;

  const Item = view === "list" ? PokemonRow : PokemonCard;

  return (
    <div className="collection">
      <ul className={`collection__items collection__items--${view}`} aria-label={label}>
        {visible.map((pokemon, index) => (
          <Item
            key={pokemon.id}
            index={index}
            pokemon={pokemon}
            favorite={favoriteIds.has(pokemon.id)}
            inCompare={compareIds.includes(pokemon.id)}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </ul>

      {hasMore && (
        <div className="collection__more">
          <span ref={sentinelRef} className="collection__sentinel" aria-hidden="true" />
          <p className="collection__progress numeric">
            {shown} / {total}
          </p>
          <button type="button" className="btn btn--ghost" onClick={loadMore}>
            <Icon name="chevronDown" size={16} />
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
}
