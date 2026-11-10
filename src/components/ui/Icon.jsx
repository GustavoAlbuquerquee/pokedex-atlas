/**
 * Conjunto de ícones próprio, em SVG inline.
 *
 * Desenhados sobre a mesma grade de 24×24 e com o mesmo traço (2px, pontas
 * arredondadas), para a interface ter um só vocabulário visual. Ficar sem
 * biblioteca de ícones também evita somar ~50 kB ao bundle por uns vinte
 * glifos.
 *
 * Todos são decorativos (`aria-hidden`): o texto acessível fica no botão que os
 * usa, não no ícone.
 */
const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.8 4.8" />
    </>
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  star: <path d="M12 3.6l2.65 5.5 6 .9-4.32 4.22.98 6-5.31-2.85L6.69 20.2l.98-6-4.32-4.2 6-.9z" />,
  heart: <path d="M12 20s-7.5-4.3-7.5-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.7c0 5-7.5 9.3-7.5 9.3z" />,
  sword: (
    <>
      <path d="M14.5 3.5h6v6L11 19l-3-3z" />
      <path d="M8 16l-4.5 4.5M5.5 13.5L10.5 18.5" />
    </>
  ),
  shield: <path d="M12 3.2l7 2.6v5.4c0 4.3-2.9 7.9-7 9.6-4.1-1.7-7-5.3-7-9.6V5.8z" />,
  spark: (
    <>
      <path d="M12 2.8l1.9 5.1 5.1 1.9-5.1 1.9L12 16.8l-1.9-5.1L5 9.8l5.1-1.9z" />
      <path d="M18.5 15.5l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
    </>
  ),
  aegis: (
    <>
      <path d="M12 3.2l7 2.6v5.4c0 4.3-2.9 7.9-7 9.6-4.1-1.7-7-5.3-7-9.6V5.8z" />
      <path d="M9 11.8l2.1 2.2L15.2 10" />
    </>
  ),
  bolt: <path d="M13.4 2.5L5.8 13.2h4.6l-.8 8.3 7.6-10.7h-4.6z" />,
  dice: (
    <>
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4" />
      <circle cx="8.7" cy="8.7" r="1.2" className="icon__dot" />
      <circle cx="15.3" cy="8.7" r="1.2" className="icon__dot" />
      <circle cx="12" cy="12" r="1.2" className="icon__dot" />
      <circle cx="8.7" cy="15.3" r="1.2" className="icon__dot" />
      <circle cx="15.3" cy="15.3" r="1.2" className="icon__dot" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M5.2 18.8l1.7-1.7M17.1 6.9l1.7-1.7" />
    </>
  ),
  moon: <path d="M19.8 14.7A8 8 0 0 1 9.3 4.2a8 8 0 1 0 10.5 10.5z" />,
  chevronLeft: <path d="M14.8 5.2L8 12l6.8 6.8" />,
  chevronRight: <path d="M9.2 5.2L16 12l-6.8 6.8" />,
  chevronDown: <path d="M5.2 9.2L12 16l6.8-6.8" />,
  arrowUp: <path d="M12 19.2V4.8M6.2 10.6L12 4.8l5.8 5.8" />,
  arrowDown: <path d="M12 4.8v14.4M6.2 13.4L12 19.2l5.8-5.8" />,
  arrowRight: <path d="M4.8 12h14.4M13.4 6.2L19.2 12l-5.8 5.8" />,
  grid: (
    <>
      <rect x="3.6" y="3.6" width="7.2" height="7.2" rx="2.2" />
      <rect x="13.2" y="3.6" width="7.2" height="7.2" rx="2.2" />
      <rect x="3.6" y="13.2" width="7.2" height="7.2" rx="2.2" />
      <rect x="13.2" y="13.2" width="7.2" height="7.2" rx="2.2" />
    </>
  ),
  rows: (
    <>
      <rect x="3.4" y="4.6" width="17.2" height="5" rx="2.2" />
      <rect x="3.4" y="14.4" width="17.2" height="5" rx="2.2" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7.5h10M18 7.5h2M4 16.5h4M12 16.5h8" />
      <circle cx="16" cy="7.5" r="2.2" />
      <circle cx="10" cy="16.5" r="2.2" />
    </>
  ),
  scales: (
    <>
      <path d="M12 4.2v15.6M7.4 19.8h9.2" />
      <path d="M4 9.2h16M4 9.2l-2 4.4a3.4 3.4 0 0 0 4 0zM20 9.2l2 4.4a3.4 3.4 0 0 1-4 0z" />
      <path d="M12 4.2L4 9.2M12 4.2l8 5" />
    </>
  ),
  users: (
    <>
      <circle cx="9.4" cy="8.4" r="3.6" />
      <path d="M3.2 20.2a6.4 6.4 0 0 1 12.4 0" />
      <path d="M15.6 5.2a3.6 3.6 0 0 1 0 6.9M17.4 14.6a6.4 6.4 0 0 1 3.4 5.6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20.2h16" />
      <rect x="5.4" y="12" width="3.6" height="6" rx="1.4" />
      <rect x="10.4" y="7.4" width="3.6" height="10.6" rx="1.4" />
      <rect x="15.4" y="4" width="3.6" height="14" rx="1.4" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4.2h8v4.4a4 4 0 0 1-8 0z" />
      <path d="M8 5.6H5.4a2.6 2.6 0 0 0 2.6 4M16 5.6h2.6a2.6 2.6 0 0 1-2.6 4" />
      <path d="M12 12.6v3.4M8.8 19.8h6.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11v5.4" />
      <circle cx="12" cy="7.9" r="1" className="icon__dot" />
    </>
  ),
  trash: (
    <>
      <path d="M4.6 7.2h14.8M9.4 7.2V5.4h5.2v1.8" />
      <path d="M6.6 7.2l.9 12.2h9l.9-12.2" />
      <path d="M10.4 10.8v5.4M13.6 10.8v5.4" />
    </>
  ),
  plus: <path d="M12 5.4v13.2M5.4 12h13.2" />,
  check: <path d="M5.2 12.6l4.6 4.6 9-9.8" />,
  pokeball: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h5.2M15.4 12h5.2" />
      <circle cx="12" cy="12" r="2.9" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.6" r="5.4" />
      <path d="M8.4 14.2L7 21l5-2.6L17 21l-1.4-6.8" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.4l8.4 4.4L12 12.2 3.6 7.8z" />
      <path d="M3.6 12.4L12 16.8l8.4-4.4M3.6 16.6L12 21l8.4-4.4" />
    </>
  ),
  external: (
    <>
      <path d="M13.4 4.6h6v6" />
      <path d="M19.4 4.6L11 13" />
      <path d="M18 14.4v3.4a2.2 2.2 0 0 1-2.2 2.2H6.4A2.2 2.2 0 0 1 4.2 17.8V8.4a2.2 2.2 0 0 1 2.2-2.2h3.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};

export default function Icon({ name, size = 20, filled = false, className = "", strokeWidth = 1.8 }) {
  const content = PATHS[name];
  if (!content) return null;

  return (
    <svg
      className={`icon${filled ? " icon--filled" : ""}${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}
