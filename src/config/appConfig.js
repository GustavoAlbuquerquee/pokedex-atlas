/**
 * Configuração central do Pokédex Atlas.
 *
 * Tudo que é "constante do produto" (identidade, chaves de armazenamento,
 * endereços de imagem) mora aqui, para não ficar espalhado pelos componentes.
 */

/** Identidade e autoria do projeto. */
export const APP = Object.freeze({
  name: "Pokédex Atlas",
  tagline: "Arquivo interativo dos 151 Pokémon de Kanto",
  version: "1.0.0",
  author: "Gustavo Albuquerque",
  course: "Desenvolvimento e Integração de Aplicações Web — PUC Minas",
  activity: "Atividade 03 — Pokédex com React + Vite",
  professor: "João Paulo Aramuni",
});

/** Quantidade de Pokémon do arquivo de dados (1ª geração / Kanto). */
export const TOTAL_POKEMON = 151;

/** Maior valor base possível de um atributo. Escala das barras. */
export const STAT_MAX = 255;

/** Quantos Pokémon entram por "página" no carregamento progressivo. */
export const PAGE_SIZE = 36;

/** Quantos termos o histórico de pesquisa guarda. */
export const SEARCH_HISTORY_SIZE = 6;

/**
 * Imagens dos Pokémon — repositório público de sprites da PokéAPI.
 * As URLs são montadas a partir do ID, exatamente como a PokéAPI devolve em
 * `sprites.front_default` e `sprites.other["official-artwork"].front_default`.
 * Montar pelo ID evita uma requisição HTTP por Pokémon: a aplicação funciona
 * sem nenhuma chamada de API, e se a imagem não carregar há fallback local.
 */
const SPRITES_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const spriteUrl = (id) => `${SPRITES_BASE}/${id}.png`;
export const artworkUrl = (id) => `${SPRITES_BASE}/other/official-artwork/${id}.png`;

/**
 * Imagens dos treinadores — sprites públicos do Pokémon Showdown.
 * O pokedex-data.json só traz o nome do treinador, então aqui ficam os nomes
 * dos arquivos correspondentes, em ordem de preferência: se o primeiro não
 * carregar, o componente tenta o próximo e, no fim, mostra as iniciais.
 */
const TRAINER_SPRITES_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

const TRAINER_SPRITES = {
  ash: ["ash", "ash-gen4", "red"],
  brock: ["brock", "brock-gen3"],
  misty: ["misty", "misty-gen3"],
  "lt. surge": ["ltsurge", "ltsurge-gen3"],
  erika: ["erika", "erika-gen3"],
  koga: ["koga", "koga-gen3"],
  sabrina: ["sabrina", "sabrina-gen3"],
  blaine: ["blaine", "blaine-gen3"],
  giovanni: ["giovanni", "giovanni-gen3"],
  // O Gary dos dados é o rival "Blue" dos jogos (e do Showdown).
  gary: ["blue", "blue-gen3"],
  "team rocket": ["teamrocket", "rocketgrunt"],
  lance: ["lance", "lance-gen3"],
};

/** URLs candidatas da imagem de um treinador, em ordem de preferência. */
export function trainerSpriteUrls(name) {
  const key = String(name).trim().toLowerCase();
  const files = TRAINER_SPRITES[key] ?? [key.replace(/[^a-z0-9]/g, "")];
  return files.filter(Boolean).map((file) => `${TRAINER_SPRITES_BASE}/${file}.png`);
}

/** Chaves do localStorage (prefixadas para não colidir com outros projetos). */
export const STORAGE_KEYS = Object.freeze({
  theme: "atlas:theme",
  favorites: "atlas:favorites",
  searchHistory: "atlas:search-history",
  compare: "atlas:compare",
  density: "atlas:density",
});

/** Fontes externas usadas, documentadas também no README. */
export const CREDITS = Object.freeze([
  {
    label: "pokedex-data.json",
    detail: "Fonte obrigatória de dados da atividade (Pokémon, atributos, tipos e treinadores).",
    href: "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json",
  },
  {
    label: "PokéAPI — sprites",
    detail: "Artes oficiais e sprites dos Pokémon, carregados por URL montada a partir do ID.",
    href: "https://pokeapi.co/",
  },
  {
    label: "Pokémon Showdown",
    detail: "Sprites dos treinadores. Complemento visual: nenhum dado vem daqui.",
    href: "https://play.pokemonshowdown.com/sprites/trainers/",
  },
  {
    label: "Google Fonts",
    detail: "Tipografia Sora (títulos) e Inter (texto e interface).",
    href: "https://fonts.google.com/",
  },
]);
