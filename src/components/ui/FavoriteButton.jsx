import Icon from "./Icon";
import "./FavoriteButton.css";

/**
 * Estrela de favorito.
 *
 * `aria-pressed` comunica o estado (marcado/não marcado) em vez de só trocar o
 * ícone, e o rótulo diz o que o clique vai fazer com aquele Pokémon — "Adicionar
 * Pikachu aos favoritos" é mais útil que "Favoritar".
 */
export default function FavoriteButton({
  pokemonName,
  active,
  onToggle,
  size = "md",
  className = "",
}) {
  const label = active
    ? `Remover ${pokemonName} dos favoritos`
    : `Adicionar ${pokemonName} aos favoritos`;

  return (
    <button
      type="button"
      className={`favorite favorite--${size}${active ? " is-active" : ""}${className ? ` ${className}` : ""}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <Icon name="star" size={size === "sm" ? 15 : 18} filled={active} />
    </button>
  );
}
