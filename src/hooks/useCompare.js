import { useCallback, useMemo } from "react";
import { STORAGE_KEYS } from "../config/appConfig";
import { pokemonById } from "../services/pokedexRepository";
import useLocalStorage from "./useLocalStorage";

/**
 * Os dois Pokémon do comparador, persistidos para a escolha sobreviver ao recarregar.
 *
 * `slots` é sempre um array de dois elementos (ID ou null). Adicionar um terceiro
 * Pokémon substitui o segundo, o que mantém a regra da atividade (comparação
 * entre dois) sem precisar de aviso de erro.
 */
const EMPTY = [null, null];

export default function useCompare() {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.compare, EMPTY);

  const slots = useMemo(() => {
    const list = Array.isArray(stored) ? stored : EMPTY;
    return [0, 1].map((i) => {
      const id = Number(list[i]);
      return Number.isInteger(id) && pokemonById(id) ? id : null;
    });
  }, [stored]);

  const pair = useMemo(() => slots.map((id) => (id ? pokemonById(id) : null)), [slots]);

  const setSlot = useCallback(
    (index, pokemonId) => {
      setStored((current) => {
        const next = [...(Array.isArray(current) ? current : EMPTY)];
        next[index] = pokemonId === null ? null : Number(pokemonId);
        // O mesmo Pokémon nos dois lados não compara nada: limpa o outro slot.
        const other = index === 0 ? 1 : 0;
        if (next[other] !== null && next[other] === next[index]) next[other] = null;
        return [next[0] ?? null, next[1] ?? null];
      });
    },
    [setStored],
  );

  /** Adiciona no primeiro slot livre; se os dois estiverem ocupados, troca o segundo. */
  const add = useCallback(
    (pokemonId) => {
      const id = Number(pokemonId);
      setStored((current) => {
        const list = Array.isArray(current) ? [...current] : [...EMPTY];
        if (list[0] === id || list[1] === id) return list;
        if (!list[0]) return [id, list[1] ?? null];
        if (!list[1]) return [list[0], id];
        return [list[0], id];
      });
    },
    [setStored],
  );

  const remove = useCallback(
    (pokemonId) => {
      const id = Number(pokemonId);
      setStored((current) => {
        const list = Array.isArray(current) ? [...current] : [...EMPTY];
        return [list[0] === id ? null : (list[0] ?? null), list[1] === id ? null : (list[1] ?? null)];
      });
    },
    [setStored],
  );

  const swap = useCallback(() => {
    setStored((current) => {
      const list = Array.isArray(current) ? current : EMPTY;
      return [list[1] ?? null, list[0] ?? null];
    });
  }, [setStored]);

  const clear = useCallback(() => setStored(EMPTY), [setStored]);

  const has = useCallback((pokemonId) => slots.includes(Number(pokemonId)), [slots]);

  return {
    slots,
    pair,
    setSlot,
    add,
    remove,
    swap,
    clear,
    has,
    count: slots.filter(Boolean).length,
    isReady: Boolean(pair[0] && pair[1]),
  };
}
