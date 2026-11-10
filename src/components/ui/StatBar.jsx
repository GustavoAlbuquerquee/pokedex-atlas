import { STAT_MAX } from "../../config/appConfig";
import Icon from "./Icon";
import "./StatBar.css";

/**
 * Um atributo: rótulo, valor e barra de progresso.
 *
 * A barra é `aria-hidden` porque o valor já está escrito ao lado em texto —
 * repetir viraria ruído em leitor de tela. A escala é sempre 0..STAT_MAX (255),
 * o máximo possível de um atributo base, para as barras de dois Pokémon
 * diferentes serem comparáveis a olho.
 *
 * `delay` escalona o crescimento das barras quando um painel abre.
 */
export default function StatBar({
  stat,
  value,
  color,
  variant = "full",
  max = STAT_MAX,
  delay = 0,
  highlight = false,
  showIcon = false,
}) {
  const percent = Math.min(100, Math.round((value / max) * 1000) / 10);

  return (
    <div
      className={`stat-bar stat-bar--${variant}${highlight ? " is-highlight" : ""}`}
      style={{
        "--stat-fill": `${percent}%`,
        "--stat-color": color,
        "--stat-delay": `${delay}ms`,
      }}
    >
      <span className="stat-bar__label">
        {showIcon && <Icon name={stat.icon} size={14} />}
        <span aria-hidden={variant === "compact" ? "true" : undefined}>
          {variant === "compact" ? stat.short : stat.label}
        </span>
        {variant === "compact" && <span className="visually-hidden">{stat.label}</span>}
      </span>

      <span className="stat-bar__value numeric">{value}</span>

      <span className="stat-bar__track" aria-hidden="true">
        <span className="stat-bar__fill" />
      </span>
    </div>
  );
}
