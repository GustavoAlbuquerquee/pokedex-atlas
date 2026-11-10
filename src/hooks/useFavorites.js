import { useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "../config/appConfig";
import useLocalStorage from "./useLocalStorage";

/**
 * Favoritos persistidos no localStorage.
 *
 * No armazenamento é um array de IDs (JSON simples e legível); na aplicação é um
 * Set, para a consulta `has(id)` de cada card ser O(1). O array é saneado na
 * leitura: entradas que não são número inteiro são descartadas, de modo que um
 * valor corrompido no navegador não derrube a tela.
 */
export default function useFavorites() {
  const [ids, setIds] = useLocalStorage(STORAGE_KEYS.favorites, []);

  const favoriteIds = useMemo(() => {
    const list = Array.isArray(ids) ? ids : [];
    return new Set(list.map(Number).filter((id) => Number.isInteger(id) && id > 0));
  }, [ids]);

  const toggleFavorite = useCallback(
    (pokemonId) => {
      const id = Number(pokemonId);
      setIds((current) => {
        const list = (Array.isArray(current) ? current : []).map(Number);
        return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      });
    },
    [setIds],
  );

  const clearFavorites = useCallback(() => setIds([]), [setIds]);

  const isFavorite = useCallback((pokemonId) => favoriteIds.has(Number(pokemonId)), [
    favoriteIds,
  ]);

  return {
    favoriteIds,
    count: favoriteIds.size,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
