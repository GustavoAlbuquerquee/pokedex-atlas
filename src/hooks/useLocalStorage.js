import { useCallback, useEffect, useState } from "react";

/**
 * Conversores entre o valor em memória e o texto do localStorage.
 *
 * São constantes de módulo de propósito: passar `{ serialize, deserialize }`
 * criado dentro do componente geraria um objeto novo a cada render e faria os
 * efeitos deste hook rodarem sem necessidade.
 */
export const JSON_CODEC = Object.freeze({
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

/** Para valores que já são texto simples ("dark", "grid"). */
export const TEXT_CODEC = Object.freeze({
  serialize: String,
  deserialize: String,
});

/**
 * Estado espelhado no localStorage.
 *
 * Em aba anônima, ou com o armazenamento bloqueado, o navegador lança exceção
 * ao ler e ao gravar — por isso todo acesso é protegido. Nesse caso o valor
 * continua funcionando em memória e a aplicação não quebra.
 *
 * O hook também ouve o evento `storage`, então duas abas abertas da Pokédex
 * ficam em sincronia: favoritar em uma atualiza a outra.
 */
export default function useLocalStorage(key, initialValue, codec = JSON_CODEC) {
  const { serialize, deserialize } = codec;

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : deserialize(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // Sem armazenamento disponível: o valor vale só nesta sessão.
    }
  }, [key, value, serialize]);

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== key || event.newValue === null) return;
      try {
        setValue(deserialize(event.newValue));
      } catch {
        // Valor inválido gravado por outra aba: mantém o atual.
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, deserialize]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
