import Icon from "./Icon";
import "./EmptyState.css";

/**
 * Estado vazio: ícone, título, explicação e — o mais importante — o próximo
 * passo. Um estado vazio sem ação é um beco sem saída, então `actions` é parte
 * do desenho e não um extra.
 */
export default function EmptyState({ icon = "search", title, description, actions = [] }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__glyph" aria-hidden="true">
        <Icon name={icon} size={30} />
      </span>

      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__text">{description}</p>}

      {actions.length > 0 && (
        <div className="empty-state__actions">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`btn ${action.primary ? "btn--primary" : "btn--ghost"}`}
              onClick={action.onClick}
            >
              {action.icon && <Icon name={action.icon} size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
