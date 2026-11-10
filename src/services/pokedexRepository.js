import dataset from "../data/pokedex-data.json";
import { createPokemon } from "../domain/pokemon";
import { createPokemonType } from "../domain/pokemonTypes";
import { createTrainer } from "../domain/trainer";

/**
 * Única porta de entrada dos dados da aplicação.
 *
 * O pokedex-data.json é estático e vem empacotado no build, então tudo é
 * preparado uma vez só, quando o módulo carrega: a partir daí as consultas são
 * leituras em memória (Map por ID), sem custo de recálculo a cada render.
 *
 * Nenhuma função daqui altera o dataset: as listas são congeladas.
 */

const POKEMON = Object.freeze(
  dataset.pokemon.map(createPokemon).sort((a, b) => a.id - b.id),
);

const POKEMON_BY_ID = new Map(POKEMON.map((p) => [p.id, p]));

const TRAINERS = Object.freeze(
  dataset.trainers.map((raw) => createTrainer(raw, (id) => POKEMON_BY_ID.get(id))),
);

/** Tipos que realmente aparecem em algum Pokémon, na ordem da lista `types` do JSON. */
const TYPES = Object.freeze(
  (() => {
    const used = new Set(POKEMON.flatMap((p) => p.types.map((t) => t.name)));
    return dataset.types.filter((t) => used.has(t.name)).map(createPokemonType);
  })(),
);

const TYPE_BY_NAME = new Map(TYPES.map((t) => [t.name, t]));

/** Índice reverso: ID do Pokémon -> treinadores que o têm no time. */
const TRAINERS_BY_POKEMON = new Map();
for (const trainer of TRAINERS) {
  for (const id of new Set(trainer.pokemonIds)) {
    if (!TRAINERS_BY_POKEMON.has(id)) TRAINERS_BY_POKEMON.set(id, []);
    TRAINERS_BY_POKEMON.get(id).push(trainer);
  }
}

export const allPokemon = () => POKEMON;
export const allTrainers = () => TRAINERS;
export const allTypes = () => TYPES;

export const pokemonById = (id) => POKEMON_BY_ID.get(Number(id)) ?? null;
export const typeByName = (name) => TYPE_BY_NAME.get(name) ?? null;

/** Treinadores que têm este Pokémon no time (lista vazia se nenhum). */
export const trainersOf = (pokemonId) => TRAINERS_BY_POKEMON.get(Number(pokemonId)) ?? [];

/** Todos os IDs em ordem de número — base da navegação anterior/próximo. */
export const allPokemonIds = Object.freeze(POKEMON.map((p) => p.id));
