import { artworkUrl, spriteUrl } from "../config/appConfig";
import { normalize, padId } from "../utils/text";
import { STATS } from "./stats";
import { createPokemonType, TYPELESS } from "./pokemonTypes";

/**
 * Transforma um Pokémon cru do pokedex-data.json num objeto pronto para a tela.
 *
 * Nada é inventado: os atributos e os tipos são exatamente os do arquivo. O que
 * se acrescenta é derivado deles — número formatado, soma dos atributos, nome
 * normalizado para a pesquisa e as URLs das imagens (montadas a partir do ID).
 *
 * Pokémon sem tipo no JSON recebem "Typeless", que é um tipo real da lista
 * `types` do próprio arquivo (id 0).
 */
export function createPokemon(raw) {
  const rawTypes = raw.types?.length ? raw.types : [TYPELESS];
  const stats = Object.fromEntries(
    STATS.map(({ key }) => [key, Number(raw.stats?.[key] ?? 0)]),
  );
  const values = Object.values(stats);

  return Object.freeze({
    id: raw.id,
    name: raw.name,
    number: padId(raw.id),
    searchName: normalize(raw.name),
    types: Object.freeze(rawTypes.map(createPokemonType)),
    stats: Object.freeze(stats),
    total: values.reduce((sum, value) => sum + value, 0),
    highest: Math.max(...values),
    lowest: Math.min(...values),
    sprite: spriteUrl(raw.id),
    artwork: artworkUrl(raw.id),
  });
}
