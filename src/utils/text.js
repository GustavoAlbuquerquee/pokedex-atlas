/**
 * Normaliza um texto para comparação: minúsculo, sem acentos e sem pontuação.
 * Faz "Mr. Mime" virar "mrmime" e "Farfetch'd" virar "farfetchd", para que a
 * pesquisa encontre esses nomes mesmo digitados "errado".
 */
export function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** 25 -> "025" (o "#" é decoração e fica no CSS/JSX). */
export function padId(id) {
  return String(id).padStart(3, "0");
}

/** Plural simples em português: plural(1, "favorito") -> "1 favorito". */
export function plural(count, singular, pluralForm = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** 12.3456 -> "12,3" (uma casa, vírgula decimal). */
export function decimal(value, places = 1) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

/** 1 -> "1º", 2 -> "2º" */
export function ordinal(position) {
  return `${position}º`;
}
