import { STATS } from "../domain/stats";
import { allPokemon, allTrainers, allTypes } from "./pokedexRepository";
import { countByType, valueOf } from "./pokedexQuery";

/**
 * Leituras analíticas sobre o mesmo dataset: posições (ranks), médias,
 * distribuição por tipo e recordistas.
 *
 * São tudo estados derivados dos dados originais — nenhum atributo novo é
 * inventado, apenas calculado. Como o dataset é imutável, os resultados globais
 * são calculados uma vez e memorizados no módulo.
 */

const POKEMON = allPokemon();

/**
 * Posição de um atributo entre os 151 (1 = maior valor).
 * Empates compartilham a posição: se dois Pokémon têm o maior HP, ambos são 1º.
 */
export function rankOf(pokemon, field) {
  const value = valueOf(pokemon, field);
  return POKEMON.filter((other) => valueOf(other, field) > value).length + 1;
}

/** O atributo mais alto do Pokémon, com o valor e a posição entre os 151. */
export function strongestStat(pokemon) {
  const best = STATS.reduce((a, b) =>
    pokemon.stats[b.key] > pokemon.stats[a.key] ? b : a,
  );
  return {
    ...best,
    value: pokemon.stats[best.key],
    rank: rankOf(pokemon, best.key),
  };
}

/** O atributo mais baixo do Pokémon, com valor e posição. */
export function weakestStat(pokemon) {
  const worst = STATS.reduce((a, b) =>
    pokemon.stats[b.key] < pokemon.stats[a.key] ? b : a,
  );
  return {
    ...worst,
    value: pokemon.stats[worst.key],
    rank: rankOf(pokemon, worst.key),
  };
}

/**
 * Outros Pokémon que compartilham pelo menos um tipo com este, em ordem de
 * número. Usado na seção "da mesma família de tipos" dos detalhes.
 */
export function sameTypeAs(pokemon, limit = Infinity) {
  const names = new Set(pokemon.types.map((t) => t.name));
  const related = POKEMON.filter(
    (other) => other.id !== pokemon.id && other.types.some((t) => names.has(t.name)),
  );
  return limit === Infinity ? related : related.slice(0, limit);
}

/** Média de cada atributo (e do total) na lista recebida. */
export function averageStats(list = POKEMON) {
  if (list.length === 0) {
    return { total: 0, ...Object.fromEntries(STATS.map((s) => [s.key, 0])) };
  }
  const sums = Object.fromEntries(STATS.map((s) => [s.key, 0]));
  let total = 0;
  for (const pokemon of list) {
    for (const stat of STATS) sums[stat.key] += pokemon.stats[stat.key];
    total += pokemon.total;
  }
  const averages = Object.fromEntries(
    STATS.map((s) => [s.key, sums[s.key] / list.length]),
  );
  return { ...averages, total: total / list.length };
}

/**
 * Distribuição por tipo, em ordem decrescente de quantidade.
 * Cada item traz o tipo completo (com cor) e a fração sobre o total da lista.
 */
export function typeDistribution(list = POKEMON) {
  const counts = countByType(list);
  return allTypes()
    .map((type) => ({
      type,
      count: counts.get(type.name) ?? 0,
      share: list.length > 0 ? (counts.get(type.name) ?? 0) / list.length : 0,
    }))
    .sort((a, b) => b.count - a.count || a.type.id - b.type.id);
}

/** O Pokémon com o maior valor em cada atributo (e no total). */
export function recordHolders(list = POKEMON) {
  const fields = [...STATS, { key: "total", label: "Total de atributos", short: "TOT" }];
  return fields.map((field) => {
    const best = list.reduce((a, b) => {
      const av = field.key === "total" ? a.total : a.stats[field.key];
      const bv = field.key === "total" ? b.total : b.stats[field.key];
      return bv > av ? b : a;
    });
    return {
      field,
      pokemon: best,
      value: field.key === "total" ? best.total : best.stats[field.key],
    };
  });
}

/** Números gerais do arquivo de dados, para o painel de estatísticas. */
export function datasetOverview() {
  const trainers = allTrainers();
  const dualType = POKEMON.filter((p) => p.types.length > 1).length;
  const ownedIds = new Set(trainers.flatMap((t) => t.pokemonIds));
  return {
    pokemonCount: POKEMON.length,
    typeCount: allTypes().length,
    trainerCount: trainers.length,
    badgeTotal: trainers.reduce((sum, t) => sum + t.badges, 0),
    dualTypeCount: dualType,
    singleTypeCount: POKEMON.length - dualType,
    ownedCount: ownedIds.size,
    averages: averageStats(POKEMON),
  };
}

/**
 * Comparação entre dois Pokémon, atributo por atributo.
 * `winner` é "a", "b" ou "tie" — quem tem o valor maior naquele atributo.
 */
export function comparePokemon(a, b) {
  const rows = [...STATS, { key: "total", label: "Total de atributos", short: "TOT" }].map(
    (field) => {
      const valueA = field.key === "total" ? a.total : a.stats[field.key];
      const valueB = field.key === "total" ? b.total : b.stats[field.key];
      return {
        field,
        valueA,
        valueB,
        diff: valueA - valueB,
        winner: valueA === valueB ? "tie" : valueA > valueB ? "a" : "b",
      };
    },
  );

  const winsA = rows.filter((r) => r.field.key !== "total" && r.winner === "a").length;
  const winsB = rows.filter((r) => r.field.key !== "total" && r.winner === "b").length;

  return {
    rows,
    winsA,
    winsB,
    overall: winsA === winsB ? "tie" : winsA > winsB ? "a" : "b",
  };
}
