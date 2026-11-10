import { STATS } from "../domain/stats";
import { normalize } from "../utils/text";

/**
 * Pesquisa, filtro e ordenação — a regra de negócio da Pokédex, isolada da
 * interface. Nenhuma função daqui conhece React: recebem uma lista e devolvem
 * outra, o que as torna fáceis de testar e de reusar em qualquer tela.
 */

/** Aceita "25", "#25", "025", "# 025" como pesquisa por número. */
const ID_PATTERN = /^#?\s*0*(\d{1,3})$/;

/**
 * Filtra por texto (nome ou ID) e por tipos.
 *
 * - Texto numérico ("25", "#025") casa o ID exato.
 * - Texto alfabético casa parte do nome, ignorando acentos e pontuação:
 *   "mr mime" encontra "Mr. Mime", "farfetchd" encontra "Farfetch'd".
 * - `types` é uma lista: vazia não filtra nada; com mais de um tipo, o modo
 *   "all" exige que o Pokémon tenha todos (ex.: Planta **e** Venenoso) e o modo
 *   "any" aceita qualquer um deles.
 *
 * Pesquisa e filtro são independentes e se combinam sem conflito, porque ambos
 * são apenas condições aplicadas ao mesmo `filter`.
 */
export function filterPokemon(list, { search = "", types = [], typeMode = "all" } = {}) {
  const text = search.trim();
  const idMatch = text.match(ID_PATTERN);
  const name = normalize(text);
  const hasTypeFilter = types.length > 0;

  return list.filter((pokemon) => {
    if (hasTypeFilter) {
      const names = pokemon.types.map((t) => t.name);
      const matches =
        typeMode === "any"
          ? types.some((t) => names.includes(t))
          : types.every((t) => names.includes(t));
      if (!matches) return false;
    }

    if (!text) return true;
    if (idMatch) return pokemon.id === Number(idMatch[1]);
    return name !== "" && pokemon.searchName.includes(name);
  });
}

/** Campos de ordenação: número, nome, os seis atributos e o total. */
export const SORT_FIELDS = Object.freeze([
  { value: "id", label: "Número", defaultDirection: "asc" },
  { value: "name", label: "Nome", defaultDirection: "asc" },
  { value: "total", label: "Total de atributos", defaultDirection: "desc" },
  ...STATS.map((stat) => ({
    value: stat.key,
    label: stat.label,
    defaultDirection: "desc",
  })),
]);

const SORT_FIELD_BY_VALUE = new Map(SORT_FIELDS.map((f) => [f.value, f]));

export const sortFieldLabel = (value) => SORT_FIELD_BY_VALUE.get(value)?.label ?? value;
export const defaultDirectionOf = (value) =>
  SORT_FIELD_BY_VALUE.get(value)?.defaultDirection ?? "asc";

const nameCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

/** Valor comparável de um Pokémon para um campo de ordenação. */
export function valueOf(pokemon, field) {
  if (field === "id") return pokemon.id;
  if (field === "total") return pokemon.total;
  return pokemon.stats[field] ?? 0;
}

/**
 * Ordena sem alterar a lista recebida. Empates são desfeitos pelo número, para
 * a ordem ficar estável e previsível entre renders.
 */
export function sortPokemon(list, { field = "id", direction = "asc" } = {}) {
  const sign = direction === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    const diff =
      field === "name"
        ? nameCollator.compare(a.name, b.name)
        : valueOf(a, field) - valueOf(b, field);
    return diff !== 0 ? diff * sign : a.id - b.id;
  });
}

/** Quantos Pokémon da lista têm cada tipo: Map("Fire" -> 12). */
export function countByType(list) {
  const counts = new Map();
  for (const pokemon of list) {
    for (const type of pokemon.types) {
      counts.set(type.name, (counts.get(type.name) ?? 0) + 1);
    }
  }
  return counts;
}
