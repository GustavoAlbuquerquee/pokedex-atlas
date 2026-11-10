import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PokemonDetails from "./components/pokemon/PokemonDetails";
import AppShell from "./components/layout/AppShell";
import Modal from "./components/ui/Modal";
import { APP, STORAGE_KEYS, TOTAL_POKEMON } from "./config/appConfig";
import useCompare from "./hooks/useCompare";
import useFavorites from "./hooks/useFavorites";
import useHashRoute from "./hooks/useHashRoute";
import useLocalStorage, { TEXT_CODEC } from "./hooks/useLocalStorage";
import useSearchHistory from "./hooks/useSearchHistory";
import useTheme from "./hooks/useTheme";
import {
  allPokemon,
  allPokemonIds,
  allTrainers,
  pokemonById,
} from "./services/pokedexRepository";
import AboutView from "./views/AboutView";
import CompareView from "./views/CompareView";
import FavoritesView from "./views/FavoritesView";
import PokedexView from "./views/PokedexView";
import StatsView from "./views/StatsView";
import TrainersView from "./views/TrainersView";
import "./App.css";

const POKEMON = allPokemon();
const TRAINER_COUNT = allTrainers().length;

/** Telas com conteúdo de lista — as que o botão "fechar detalhes" pode devolver. */
const LIST_VIEWS = new Set(["pokedex", "favoritos", "treinadores", "estatisticas", "comparar"]);

const PAGE_META = {
  pokedex: { title: "Pokédex", subtitle: `Os ${TOTAL_POKEMON} Pokémon de Kanto` },
  favoritos: { title: "Favoritos", subtitle: "Salvos neste navegador" },
  comparar: { title: "Comparar", subtitle: "Dois Pokémon, atributo por atributo" },
  treinadores: { title: "Treinadores", subtitle: "Insígnias e times do arquivo de dados" },
  estatisticas: { title: "Estatísticas", subtitle: "Leitura geral do acervo" },
  sobre: { title: "Sobre", subtitle: `${APP.name} · ${APP.author}` },
};

/**
 * Orquestrador da aplicação.
 *
 * Aqui ficam apenas três coisas: a composição das telas, o estado que é
 * realmente global (tema, favoritos, comparação, histórico, rota) e a navegação
 * entre elas. Toda regra de dados mora em `services/`, todo estado de uma tela
 * mora na própria tela ou em um hook — o que mantém este arquivo legível em vez
 * de virar o depósito de tudo.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const favorites = useFavorites();
  const compare = useCompare();
  const searchHistory = useSearchHistory();
  const { route, navigate, replace } = useHashRoute();

  /** Grade ou lista — preferência de exibição, guardada entre visitas. */
  const [storedView, setStoredView] = useLocalStorage(
    STORAGE_KEYS.density,
    "grid",
    TEXT_CODEC,
  );
  const view = storedView === "list" ? "list" : "grid";

  /**
   * Contexto do dossiê aberto: a ordem pela qual anterior/próximo navega e a
   * rota para onde o fechamento volta. Fica em estado porque não cabe na URL
   * sem poluí-la, mas o Pokémon aberto *está* na URL — então o endereço é
   * compartilhável e o botão "voltar" do navegador funciona.
   */
  const [detailsContext, setDetailsContext] = useState({
    order: allPokemonIds,
    returnPath: "pokedex",
  });

  /** Pedido de filtro por tipo vindo de outra tela (detalhes, estatísticas). */
  const [pendingType, setPendingType] = useState(null);

  const isDetails = route.view === "pokemon";
  const openPokemon = isDetails ? pokemonById(route.param) : null;

  /**
   * Ordem efetiva do dossê aberto.
   *
   * Normalmente é a lista pela qual o usuário chegou (o resultado filtrado, ou o
   * time de um treinador). Mas o Pokémon também pode vir de fora dessa lista —
   * por um endereço colado, pelo botão "voltar" do navegador ou pelos recordes
   * das estatísticas. Nesse caso a ordem guardada não o contém e "anterior/
   * próximo" ficariam mortos: aí vale a Pokédex inteira.
   */
  const detailsOrder = useMemo(() => {
    if (!openPokemon) return allPokemonIds;
    return detailsContext.order.includes(openPokemon.id)
      ? detailsContext.order
      : allPokemonIds;
  }, [openPokemon, detailsContext.order]);

  // Rota desconhecida (ou dossiê aberto) cai na tela guardada no contexto.
  const activeView = useMemo(() => {
    if (isDetails) {
      const base = detailsContext.returnPath.split("/")[0];
      return LIST_VIEWS.has(base) ? base : "pokedex";
    }
    return PAGE_META[route.view] ? route.view : "pokedex";
  }, [isDetails, route.view, detailsContext.returnPath]);

  /**
   * Trocar de tela volta ao topo.
   *
   * Sem isto, sair de uma Pokédex rolada até o #120 e entrar em "Sobre"
   * abriria a página no meio. A rolagem só é reposta quando a *tela* muda:
   * abrir e fechar um dossê mantém o usuário onde estava na lista.
   */
  const lastView = useRef(activeView);
  useEffect(() => {
    if (lastView.current === activeView) return;
    lastView.current = activeView;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeView]);

  const currentPath = useMemo(
    () => (route.segments.length > 0 ? route.segments.join("/") : "pokedex"),
    [route.segments],
  );

  // ---------------------------------------------------------------- navegação
  const openDetails = useCallback(
    (id, order = allPokemonIds) => {
      // Sem repetições: o time do Koga tem três Venonat, e "anterior/próximo"
      // precisa de uma lista em que cada ID apareça uma única vez.
      const list = order.length > 0 ? [...new Set(order)] : allPokemonIds;
      setDetailsContext((current) => ({
        order: list,
        // Abrir um Pokémon a partir de outro dossiê mantém o destino do "fechar".
        returnPath: route.view === "pokemon" ? current.returnPath : currentPath,
      }));
      navigate(`pokemon/${id}`);
    },
    [navigate, route.view, currentPath],
  );

  const closeDetails = useCallback(() => {
    replace(detailsContext.returnPath || "pokedex");
  }, [replace, detailsContext.returnPath]);

  /** Navega dentro do dossiê sem empilhar uma entrada por Pokémon visitado. */
  const goToPokemon = useCallback((id) => replace(`pokemon/${id}`), [replace]);

  const openRandom = useCallback(() => {
    const currentId = openPokemon?.id ?? null;
    let pick;
    do {
      pick = POKEMON[Math.floor(Math.random() * POKEMON.length)];
    } while (pick.id === currentId && POKEMON.length > 1);

    if (isDetails) goToPokemon(pick.id);
    else openDetails(pick.id, allPokemonIds);
  }, [openPokemon, isDetails, goToPokemon, openDetails]);

  const filterByType = useCallback(
    (typeName) => {
      setPendingType(typeName);
      navigate("pokedex");
    },
    [navigate],
  );

  const openTrainer = useCallback((trainerId) => navigate(`treinadores/${trainerId}`), [navigate]);

  const goToPokedex = useCallback(() => navigate("pokedex"), [navigate]);

  /** A balança dos cards é um interruptor: marcada, desmarca. */
  const toggleCompare = useCallback(
    (id) => (compare.has(id) ? compare.remove(id) : compare.add(id)),
    [compare],
  );

  // ------------------------------------------------------------------- partes
  const navItems = useMemo(
    () => [
      { id: "pokedex", label: "Pokédex", shortLabel: "Pokédex", icon: "pokeball" },
      { id: "favoritos", label: "Favoritos", icon: "star", count: favorites.count, badge: true },
      { id: "comparar", label: "Comparar", icon: "scales", count: compare.count, badge: true },
      { id: "treinadores", label: "Treinadores", shortLabel: "Treinos", icon: "users", count: TRAINER_COUNT },
      { id: "estatisticas", label: "Estatísticas", shortLabel: "Dados", icon: "chart" },
      { id: "sobre", label: "Sobre", icon: "info", secondary: true },
    ],
    [favorites.count, compare.count],
  );

  const browserProps = {
    favoriteIds: favorites.favoriteIds,
    compareIds: compare.slots,
    onOpen: openDetails,
    onToggleFavorite: favorites.toggleFavorite,
    onToggleCompare: toggleCompare,
    searchHistory: searchHistory.history,
    onRememberSearch: searchHistory.remember,
    onClearSearchHistory: searchHistory.clear,
    view,
    onViewChange: setStoredView,
  };

  function renderView() {
    switch (activeView) {
      case "favoritos":
        return (
          <FavoritesView
            {...browserProps}
            onGoToPokedex={goToPokedex}
            onClearFavorites={favorites.clearFavorites}
          />
        );
      case "comparar":
        return (
          <CompareView
            compare={compare}
            onOpenPokemon={(id) => openDetails(id, allPokemonIds)}
            onGoToPokedex={goToPokedex}
          />
        );
      case "treinadores":
        return (
          <TrainersView
            highlightId={route.view === "treinadores" ? route.param : null}
            onOpenPokemon={openDetails}
          />
        );
      case "estatisticas":
        return (
          <StatsView
            favoriteCount={favorites.count}
            onSelectType={filterByType}
            onOpenPokemon={(id) => openDetails(id, allPokemonIds)}
          />
        );
      case "sobre":
        return <AboutView />;
      default:
        return (
          <PokedexView
            {...browserProps}
            onRandom={openRandom}
            externalTypeFilter={pendingType}
            onExternalTypeFilterApplied={() => setPendingType(null)}
          />
        );
    }
  }

  const meta = PAGE_META[activeView] ?? PAGE_META.pokedex;

  return (
    <>
      <AppShell
        items={navItems}
        current={activeView}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRandom={openRandom}
        title={meta.title}
        subtitle={meta.subtitle}
      >
        {renderView()}
      </AppShell>

      <Modal
        open={Boolean(openPokemon)}
        onClose={closeDetails}
        labelledBy="details-title"
        closeLabel="Fechar detalhes"
      >
        {openPokemon && (
          <PokemonDetails
            pokemon={openPokemon}
            order={detailsOrder}
            titleId="details-title"
            favorite={favorites.isFavorite(openPokemon.id)}
            inCompare={compare.has(openPokemon.id)}
            onToggleFavorite={favorites.toggleFavorite}
            onToggleCompare={toggleCompare}
            onNavigate={goToPokemon}
            onOpenPokemon={goToPokemon}
            onOpenTrainer={openTrainer}
            onFilterType={filterByType}
          />
        )}
      </Modal>
    </>
  );
}
