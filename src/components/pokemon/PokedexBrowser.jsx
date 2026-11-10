import { useCallback, useEffect, useMemo } from "react";
import usePokedexQuery from "../../hooks/usePokedexQuery";
import { allTypes } from "../../services/pokedexRepository";
import { plural } from "../../utils/text";
import EmptyState from "../ui/EmptyState";
import SegmentedControl from "../ui/SegmentedControl";
import PokemonCollection from "./PokemonCollection";
import SearchField from "./SearchField";
import SortControl from "./SortControl";
import TypeFilterBar from "./TypeFilterBar";
import "./PokedexBrowser.css";

const TYPES = allTypes();

const VIEW_OPTIONS = [
  { value: "grid", icon: "grid", title: "Ver em grade" },
  { value: "list", icon: "rows", title: "Ver em lista" },
];

/**
 * Superfície de navegação da Pokédex: barra de ferramentas + resultado.
 *
 * É usada tanto pela tela da Pokédex quanto pela de Favoritos — a única
 * diferença entre elas é a lista base e a mensagem de lista vazia, que chegam
 * por prop. Reaproveitar o componente garante que pesquisa, filtro, ordenação e
 * carregamento progressivo se comportem igual nas duas.
 *
 * `externalTypeFilter` permite que outra tela (os detalhes, as estatísticas)
 * mande "mostre o tipo Fogo": o efeito aplica o pedido uma vez e o devolve
 * limpo, para o usuário continuar livre de mexer nos filtros depois.
 */
export default function PokedexBrowser({
  baseList,
  favoriteIds,
  compareIds,
  onOpen,
  onToggleFavorite,
  onToggleCompare,
  searchHistory,
  onRememberSearch,
  onClearSearchHistory,
  view,
  onViewChange,
  emptyWhenNoBase,
  externalTypeFilter,
  onExternalTypeFilterApplied,
  totalLabel = "Pokémon",
  totalLabelPlural = totalLabel,
}) {
  const query = usePokedexQuery(baseList);
  const { results } = query;

  // Pedido de filtro vindo de outra tela.
  useEffect(() => {
    if (!externalTypeFilter) return;
    query.setSearch("");
    query.setTypes([externalTypeFilter]);
    onExternalTypeFilterApplied?.();
    // `query` muda a cada render; o efeito depende apenas do pedido externo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalTypeFilter]);

  // Guarda no histórico apenas pesquisas que acharam algo, depois de o usuário
  // parar de digitar — senão "p", "pi", "pik" entrariam todas na lista.
  const { search } = query;
  useEffect(() => {
    const term = search.trim();
    if (term.length < 2 || results.length === 0) return;
    const timer = setTimeout(() => onRememberSearch(term), 900);
    return () => clearTimeout(timer);
  }, [search, results.length, onRememberSearch]);

  // A ordem visível alimenta a navegação "anterior/próximo" dos detalhes.
  // Memorizada para os cards (`memo`) não redesenharem a cada render do pai.
  const visibleOrder = useMemo(() => results.map((pokemon) => pokemon.id), [results]);
  const open = useCallback((id) => onOpen(id, visibleOrder), [onOpen, visibleOrder]);

  if (baseList.length === 0 && emptyWhenNoBase) return emptyWhenNoBase;

  const countText = query.isFiltering
    ? `${results.length} de ${plural(baseList.length, totalLabel, totalLabelPlural)}`
    : plural(results.length, totalLabel, totalLabelPlural);

  return (
    <div className="browser">
      <div className="browser__toolbar panel">
        <div className="browser__row">
          <SearchField
            value={query.search}
            onChange={query.setSearch}
            history={searchHistory}
            onClearHistory={onClearSearchHistory}
          />

          <SortControl
            sort={query.sort}
            onFieldChange={query.sortBy}
            onToggleDirection={query.toggleDirection}
          />

          <SegmentedControl
            label="Forma de exibição"
            options={VIEW_OPTIONS}
            value={view}
            onChange={onViewChange}
          />
        </div>

        <TypeFilterBar
          types={TYPES}
          counts={query.typeCounts}
          total={baseList.length}
          selected={query.types}
          mode={query.typeMode}
          onToggle={query.toggleType}
          onClear={query.clearTypes}
          onModeChange={query.setTypeMode}
        />
      </div>

      <div className="browser__meta">
        <p className="browser__count" aria-live="polite">
          {countText}
        </p>

        {query.isFiltering && (
          <button type="button" className="btn btn--quiet btn--sm" onClick={query.clearFilters}>
            Limpar pesquisa e filtros
          </button>
        )}
      </div>

      <PokemonCollection
        pokemons={results}
        view={view}
        favoriteIds={favoriteIds}
        compareIds={compareIds}
        onOpen={open}
        onToggleFavorite={onToggleFavorite}
        onToggleCompare={onToggleCompare}
        label={`Lista de ${totalLabelPlural}`}
        emptyState={
          <EmptyState
            icon="search"
            title={
              query.search.trim()
                ? `Nada encontrado para “${query.search.trim()}”`
                : "Nenhum Pokémon com esses filtros"
            }
            description={
              query.types.length > 1 && query.typeMode === "all"
                ? "Nenhum Pokémon reúne todos os tipos marcados ao mesmo tempo. Troque a combinação para OU ou desmarque um tipo."
                : "Confira a grafia ou pesquise pelo número, de 1 a 151."
            }
            actions={[
              {
                label: "Limpar pesquisa e filtros",
                onClick: query.clearFilters,
                primary: true,
                icon: "close",
              },
            ]}
          />
        }
      />
    </div>
  );
}
