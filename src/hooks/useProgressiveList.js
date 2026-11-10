import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAGE_SIZE } from "../config/appConfig";

/**
 * Carregamento progressivo da grade.
 *
 * Com 151 Pokémon, cada um com arte e seis barras, montar tudo de uma vez é
 * desperdício: o usuário vê no máximo duas fileiras. Este hook mostra uma fatia
 * e cresce quando a sentinela entra na tela (IntersectionObserver) ou quando o
 * usuário aperta "Carregar mais".
 *
 * A fatia volta ao tamanho inicial sempre que a lista muda (novo filtro), senão
 * o usuário ficaria preso no fim de uma lista antiga.
 */
export default function useProgressiveList(list, pageSize = PAGE_SIZE) {
  const [limit, setLimit] = useState(pageSize);
  const [shownList, setShownList] = useState(list);
  const sentinelRef = useRef(null);

  // Ajuste de estado durante a renderização (padrão recomendado pelo React para
  // "estado derivado de props"): trocar a lista volta a fatia ao tamanho inicial
  // sem passar por um efeito, que causaria um render extra com a fatia errada.
  if (shownList !== list) {
    setShownList(list);
    setLimit(pageSize);
  }

  const visible = useMemo(() => list.slice(0, limit), [list, limit]);
  const hasMore = limit < list.length;

  const loadMore = useCallback(() => {
    setLimit((current) => Math.min(current + pageSize, list.length));
  }, [pageSize, list.length]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return {
    visible,
    hasMore,
    loadMore,
    sentinelRef,
    shown: visible.length,
    total: list.length,
  };
}
