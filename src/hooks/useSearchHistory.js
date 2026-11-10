import { useCallback, useMemo } from "react";
import { SEARCH_HISTORY_SIZE, STORAGE_KEYS } from "../config/appConfig";
import useLocalStorage from "./useLocalStorage";

/**
 * Histórico dos últimos termos pesquisados, persistido no localStorage.
 *
 * Só entram termos com resultado — guardar uma busca que não achou nada não
 * ajuda ninguém. O termo mais recente fica no topo e repetições são promovidas
 * em vez de duplicadas.
 */
export default function useSearchHistory() {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.searchHistory, []);

  const history = useMemo(
    () => (Array.isArray(stored) ? stored.filter((t) => typeof t === "string") : []),
    [stored],
  );

  const remember = useCallback(
    (term) => {
      const value = String(term ?? "").trim();
      if (value.length < 2) return;
      setStored((current) => {
        const list = Array.isArray(current) ? current : [];
        const withoutDuplicate = list.filter(
          (item) => item.toLowerCase() !== value.toLowerCase(),
        );
        return [value, ...withoutDuplicate].slice(0, SEARCH_HISTORY_SIZE);
      });
    },
    [setStored],
  );

  const clear = useCallback(() => setStored([]), [setStored]);

  return { history, remember, clear };
}
