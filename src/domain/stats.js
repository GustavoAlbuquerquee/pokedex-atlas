/**
 * Os seis atributos do pokedex-data.json, na ordem em que aparecem na interface.
 *
 * `key`   — nome do campo dentro de `stats` no JSON (não mudar).
 * `label` — rótulo completo, usado nos detalhes e na comparação.
 * `short` — rótulo curto dos cards e da tabela compacta.
 * `icon`  — nome do ícone no componente <Icon />.
 */
export const STATS = Object.freeze([
  { key: "hp", label: "HP", short: "HP", icon: "heart" },
  { key: "attack", label: "Ataque", short: "ATQ", icon: "sword" },
  { key: "defense", label: "Defesa", short: "DEF", icon: "shield" },
  { key: "specialAttack", label: "Ataque Especial", short: "AT.E", icon: "spark" },
  { key: "specialDefense", label: "Defesa Especial", short: "DF.E", icon: "aegis" },
  { key: "speed", label: "Velocidade", short: "VEL", icon: "bolt" },
]);

/** Mapa key -> definição, para buscar um atributo sem varrer a lista. */
export const STAT_BY_KEY = Object.freeze(
  Object.fromEntries(STATS.map((stat) => [stat.key, stat])),
);

/** Chaves dos seis atributos. */
export const STAT_KEYS = Object.freeze(STATS.map((stat) => stat.key));
