import { APP } from "../../config/appConfig";
import Icon from "../ui/Icon";
import "./AppShell.css";

/**
 * Moldura da aplicação: navegação lateral no desktop, barra inferior no celular
 * e a área de conteúdo.
 *
 * O shell só compõe — não sabe o que cada tela faz. Ele recebe a lista de rotas,
 * a rota atual e o conteúdo, o que deixa acrescentar uma tela nova a uma questão
 * de incluir um item em `NAV_ITEMS` no App.
 */
export default function AppShell({
  items,
  current,
  onNavigate,
  theme,
  onToggleTheme,
  onRandom,
  title,
  subtitle,
  children,
}) {
  const primaryItems = items.filter((item) => !item.secondary);

  return (
    <div className="shell">
      <a className="shell__skip" href="#conteudo">
        Ir para o conteúdo
      </a>

      {/* ---------------- Navegação lateral (desktop) ---------------- */}
      <aside className="shell__side">
        <button
          type="button"
          className="shell__brand"
          onClick={() => onNavigate("pokedex")}
          aria-label={`${APP.name} — ir para a Pokédex`}
        >
          <span className="shell__brand-mark" aria-hidden="true">
            <Icon name="pokeball" size={22} />
          </span>
          <span className="shell__brand-text">
            <strong>Pokédex</strong>
            <em>Atlas</em>
          </span>
        </button>

        <nav className="shell__nav" aria-label="Seções">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="shell__nav-item"
                  aria-current={current === item.id ? "page" : undefined}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="shell__nav-label">{item.label}</span>
                  {item.count != null && (
                    <span className="shell__nav-count numeric">{item.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shell__side-foot">
          <button
            type="button"
            className="shell__side-action"
            onClick={onRandom}
            title="Pokémon aleatório"
          >
            <Icon name="dice" size={18} />
            <span className="shell__side-action-label">Pokémon aleatório</span>
          </button>

          <button
            type="button"
            className="shell__side-action"
            onClick={onToggleTheme}
            title={theme === "dark" ? "Tema claro" : "Tema escuro"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            <span className="shell__side-action-label">
              {theme === "dark" ? "Tema claro" : "Tema escuro"}
            </span>
          </button>

          <p className="shell__credit">
            Desenvolvido por
            <br />
            <strong>{APP.author}</strong>
          </p>
        </div>
      </aside>

      {/* ---------------- Conteúdo ---------------- */}
      <div className="shell__main">
        <header className="shell__topbar">
          <button
            type="button"
            className="shell__topbar-brand"
            onClick={() => onNavigate("pokedex")}
            aria-label={`${APP.name} — ir para a Pokédex`}
          >
            <Icon name="pokeball" size={20} />
          </button>

          <div className="shell__topbar-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="shell__topbar-actions">
            <button
              type="button"
              className="btn btn--icon btn--ghost"
              onClick={onRandom}
              aria-label="Abrir um Pokémon aleatório"
              title="Pokémon aleatório"
            >
              <Icon name="dice" size={18} />
            </button>

            <button
              type="button"
              className="btn btn--icon btn--ghost"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
              title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>

            <button
              type="button"
              className="btn btn--icon btn--ghost shell__topbar-about"
              onClick={() => onNavigate("sobre")}
              aria-label="Sobre o projeto"
              title="Sobre"
            >
              <Icon name="info" size={18} />
            </button>
          </div>
        </header>

        <main className="shell__content" id="conteudo">
          {children}
        </main>
      </div>

      {/* ---------------- Navegação inferior (celular) ---------------- */}
      <nav className="shell__tabbar" aria-label="Seções">
        <ul>
          {primaryItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="shell__tab"
                aria-current={current === item.id ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
              >
                <span className="shell__tab-icon">
                  <Icon name={item.icon} size={20} />
                  {/* O ponto sinaliza o que é do usuário (favoritos, comparação).
                      Contagens fixas, como a de treinadores, não ganham ponto. */}
                  {item.badge && item.count > 0 && (
                    <span className="shell__tab-dot" aria-hidden="true" />
                  )}
                </span>
                <span className="shell__tab-label">{item.shortLabel ?? item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
