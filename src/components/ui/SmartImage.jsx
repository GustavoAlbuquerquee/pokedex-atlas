import { useState } from "react";
import fallbackImage from "../../assets/sem-imagem.svg";
import "./SmartImage.css";

/**
 * Imagem com estado de carregamento e plano B local.
 *
 * As artes vêm da PokéAPI e os sprites de treinador do Pokémon Showdown. Como a
 * atividade exige que a aplicação continue funcionando sem internet, cada imagem
 * tem uma lista de URLs candidatas: se a primeira falha, tenta a próxima e, no
 * fim, usa o SVG local `sem-imagem.svg` (ou o conteúdo passado em `fallback`).
 */
export default function SmartImage({
  sources,
  alt,
  className = "",
  width,
  height,
  eager = false,
  pixelated = false,
  fallback = null,
}) {
  const list = (Array.isArray(sources) ? sources : [sources]).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const exhausted = index >= list.length;

  // Todas as URLs falharam e quem usou o componente deu um plano B próprio
  // (por exemplo, as iniciais do treinador).
  if (exhausted && fallback) return fallback;

  const src = exhausted ? fallbackImage : list[index];

  return (
    <img
      key={src}
      className={`smart-image${loaded ? " is-loaded" : ""}${pixelated && !exhausted ? " is-pixelated" : ""}${className ? ` ${className}` : ""}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      onLoad={() => setLoaded(true)}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}
