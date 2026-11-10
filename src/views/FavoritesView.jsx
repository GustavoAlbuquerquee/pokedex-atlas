import { useMemo } from "react";
import { allPokemon } from "../services/pokedexRepository";
import PokedexBrowser from "../components/pokemon/PokedexBrowser";
import EmptyState from "../components/ui/EmptyState";

const POKEMON = allPokemon();

/**
 * Favoritos: a mesma experiência da Pokédex, restrita aos Pokémon marcados.
 *
 * A lista base é um estado derivado dos IDs salvos no localStorage, mantida na
 * ordem numérica da Pokédex. Pesquisa, filtros e ordenação são os mesmos, porque
 * o componente de navegação é o mesmo.
 */
export default function FavoritesView({ favoriteIds, onGoToPokedex, onClearFavorites, ...rest }) {
  const favorites = useMemo(
    () => POKEMON.filter((pokemon) => favoriteIds.has(pokemon.id)),
    [favoriteIds],
  );

  return (
    <div className="favorites-view">
      <PokedexBrowser
        baseList={favorites}
        favoriteIds={favoriteIds}
        totalLabel="favorito"
        totalLabelPlural="favoritos"
        emptyWhenNoBase={
          <EmptyState
            icon="star"
            title="Você ainda não tem favoritos"
            description="Toque na estrela de qualquer Pokémon para guardá-lo aqui. A lista fica salva neste navegador, no localStorage, e continua depois de fechar a página."
            actions={[
              { label: "Ir para a Pokédex", onClick: onGoToPokedex, primary: true, icon: "pokeball" },
            ]}
          />
        }
        {...rest}
      />

      {favorites.length > 0 && (
        <div className="favorites-view__foot">
          <button type="button" className="btn btn--danger btn--sm" onClick={onClearFavorites}>
            Remover todos os {favorites.length} favoritos
          </button>
        </div>
      )}
    </div>
  );
}
