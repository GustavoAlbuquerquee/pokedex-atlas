import "./TypeBadge.css";

/**
 * Etiqueta de tipo com a cor do tipo e a tinta de maior contraste sobre ela
 * (calculada no domínio, não chutada no CSS).
 *
 * `variant="solid"` preenche com a cor — usado quando a etiqueta precisa se
 * destacar sobre a arte. `variant="soft"` usa a cor só na borda e no fundo
 * translúcido, para listas longas não virarem um mosaico cansativo.
 */
export default function TypeBadge({ type, size = "md", variant = "soft", as: Tag = "span" }) {
  return (
    <Tag
      className={`type-badge type-badge--${size} type-badge--${variant}`}
      style={{ "--type-rgb": type.rgb, "--type-ink": type.ink }}
      title={`Tipo ${type.label}`}
    >
      <span className="type-badge__dot" aria-hidden="true" />
      {type.label}
    </Tag>
  );
}
