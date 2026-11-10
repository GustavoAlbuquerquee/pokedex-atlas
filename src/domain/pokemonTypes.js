/**
 * Paleta e tradução dos tipos.
 *
 * O `name` em inglês continua sendo a chave que vem do pokedex-data.json — é ele
 * que o filtro compara. O que esta camada acrescenta é apresentação: rótulo em
 * pt-BR e a cor da identidade visual do Atlas (paleta própria, calibrada para
 * ficar legível tanto no tema claro quanto no escuro).
 */

/** Tipo atribuído a Pokémon que vêm sem tipo no JSON (o Mew, #151). */
export const TYPELESS = Object.freeze({ id: 0, name: "Typeless" });

const PALETTE = {
  Typeless: { label: "Sem tipo", color: "#94A3B8" },
  Normal: { label: "Normal", color: "#A8A29E" },
  Fire: { label: "Fogo", color: "#FF6B35" },
  Water: { label: "Água", color: "#2E86FF" },
  Grass: { label: "Planta", color: "#3FBF6F" },
  Electric: { label: "Elétrico", color: "#FFCE1F" },
  Ice: { label: "Gelo", color: "#52D1DC" },
  Fighting: { label: "Lutador", color: "#E04F5F" },
  Poison: { label: "Venenoso", color: "#B152D6" },
  Ground: { label: "Terrestre", color: "#DCA24A" },
  Flying: { label: "Voador", color: "#8BA3F7" },
  Psychic: { label: "Psíquico", color: "#FF6392" },
  Bug: { label: "Inseto", color: "#A3C644" },
  Rock: { label: "Pedra", color: "#BFA455" },
  Ghost: { label: "Fantasma", color: "#8068C4" },
  Dark: { label: "Sombrio", color: "#6F5F57" },
  Dragon: { label: "Dragão", color: "#7A5CFF" },
  Steel: { label: "Aço", color: "#9FADC2" },
};

/** Converte "#RRGGBB" em [r, g, b] normalizado (0..1). */
function channels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

/** Luminância relativa (WCAG 2.1) de uma cor hexadecimal. */
function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const LIGHT_INK = "#FFFFFF";
const DARK_INK = "#14161C";

/** Escolhe entre tinta clara e escura a que tiver mais contraste sobre a cor. */
function inkFor(hex) {
  const l = luminance(hex);
  const onLight = (l + 0.05) / (luminance(DARK_INK) + 0.05);
  const onDark = 1.05 / (l + 0.05);
  return onDark >= onLight ? LIGHT_INK : DARK_INK;
}

/** "#FF6B35" -> "255 107 53", para usar em rgb()/color-mix no CSS. */
function rgbTriplet(hex) {
  return channels(hex)
    .map((c) => Math.round(c * 255))
    .join(" ");
}

/**
 * { id, name } do JSON -> { id, name, label, color, ink, rgb }
 * `ink` é a cor de texto legível sobre `color`; `rgb` alimenta variáveis CSS.
 */
export function createPokemonType({ id, name }) {
  const info = PALETTE[name] ?? { label: name, color: PALETTE.Typeless.color };
  return Object.freeze({
    id,
    name,
    label: info.label,
    color: info.color,
    ink: inkFor(info.color),
    rgb: rgbTriplet(info.color),
  });
}
