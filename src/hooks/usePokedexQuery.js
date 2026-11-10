import { useCallback, useMemo, useState } from "react";
import {
  countByType,
  defaultDirectionOf,
  filterPokemon,
  sortPokemon,
} from "../services/pokedexQuery";

/**
 * Estado da pesquisa, do filtro por tipo e da ordenação de uma lista de Pokémon.
 *
 * A lista exibida é um **estado derivado**: não fica guardada em `useState`, é
 * recalculada com `useMemo` a partir da lista base sempre que um dos critérios
 * muda. Isso evita a classe de bug mais comum nessa tela — a lista "congelada"
 * em um resultado antigo depois de dois filtros em sequência.
 */
const EMPTY_SORT = { field: "id", direction: "asc" };

export default function usePokedexQuery(baseList) {
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [typeMode, setTypeMode] = useState("all");
  const [sort, setSort] = useState(EMPTY_SORT);

  const filtered = useMemo(
    () => filterPokemon(baseList, { search, types, typeMode }),
    [baseList, search, types, typeMode],
  );

  const results = useMemo(() => sortPokemon(filtered, sort), [filtered, sort]);

  /** Quantos Pokémon da lista base têm cada tipo (alimenta os contadores das chips). */
  const typeCounts = useMemo(() => countByType(baseList), [baseList]);

  /** Clicar num tipo já selecionado o remove: a chip funciona como interruptor. */
  const toggleType = useCallback((name) => {
    setTypes((current) =>
      current.includes(name) ? current.filter((t) => t !== name) : [...current, name],
    );
  }, []);

  const clearTypes = useCallback(() => setTypes([]), []);

  /** Trocar o campo aplica a direção mais natural dele (número: crescente; atributo: decrescente). */
  const sortBy = useCallback((field) => {
    setSort((current) =>
      current.field === field
        ? { field, direction: current.direction === "asc" ? "desc" : "asc" }
        : { field, direction: defaultDirectionOf(field) },
    );
  }, []);

  const toggleDirection = useCallback(() => {
    setSort((current) => ({
      ...current,
      direction: current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const reset = useCallback(() => {
    setSearch("");
    setTypes([]);
    setTypeMode("all");
    setSort(EMPTY_SORT);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setTypes([]);
  }, []);

  return {
    search,
    setSearch,
    types,
    setTypes,
    toggleType,
    clearTypes,
    typeMode,
    setTypeMode,
    typeCounts,
    sort,
    sortBy,
    toggleDirection,
    results,
    reset,
    clearFilters,
    /** true quando algum critério está restringindo a lista. */
    isFiltering: search.trim() !== "" || types.length > 0,
  };
}
