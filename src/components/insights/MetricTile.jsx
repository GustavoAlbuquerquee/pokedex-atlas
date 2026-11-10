import Icon from "../ui/Icon";
import "./insights.css";

/**
 * Número único em destaque (quantos Pokémon, quantos treinadores, média...).
 *
 * `hint` é onde fica o contexto: um número solto não diz nada, "151 Pokémon —
 * todos os registros do arquivo" diz.
 */
export default function MetricTile({ icon, label, value, hint, accent = false }) {
  return (
    <div className={`metric-tile${accent ? " is-accent" : ""}`}>
      <span className="metric-tile__icon" aria-hidden="true">
        <Icon name={icon} size={18} />
      </span>
      <span className="metric-tile__label">{label}</span>
      <span className="metric-tile__value numeric">{value}</span>
      {hint && <span className="metric-tile__hint">{hint}</span>}
    </div>
  );
}
