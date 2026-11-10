import { trainerSpriteUrls } from "../config/appConfig";

/** Número de insígnias de uma jornada completa em Kanto — usado só como escala visual. */
export const BADGE_SLOTS = 8;

/**
 * Transforma um treinador cru do pokedex-data.json num objeto de tela.
 *
 * `pokemonIds` é preservado como está no arquivo, inclusive a ordem e as
 * repetições (o Koga tem três Venonat). `pokemon` é a mesma lista já resolvida
 * para os objetos de Pokémon; IDs que não existirem no arquivo são descartados
 * em vez de virar um item vazio.
 */
export function createTrainer(raw, findPokemon) {
  const pokemonIds = [...raw.pokemonIds];
  const pokemon = pokemonIds.map(findPokemon).filter(Boolean);
  const initials = String(raw.name)
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return Object.freeze({
    id: raw.id,
    name: raw.name,
    initials,
    badges: Number(raw.badges ?? 0),
    pokemonIds: Object.freeze(pokemonIds),
    pokemon: Object.freeze(pokemon),
    teamSize: pokemon.length,
    sprites: Object.freeze(trainerSpriteUrls(raw.name)),
    /** Soma dos atributos do time — métrica derivada, útil para ordenar. */
    teamPower: pokemon.reduce((sum, p) => sum + p.total, 0),
  });
}
