import { useState } from "react";
import CompareSlot from "../components/compare/CompareSlot";
import CompareTable from "../components/compare/CompareTable";
import PokemonPicker from "../components/compare/PokemonPicker";
import EmptyState from "../components/ui/EmptyState";
import Icon from "../components/ui/Icon";
import { comparePokemon } from "../services/pokedexInsights";
import "./CompareView.css";

/**
 * Comparação entre dois Pokémon.
 *
 * O estado dos dois lados vive no hook `useCompare` (persistido), e não aqui:
 * assim o usuário pode marcar Pokémon para comparar direto na grade da Pokédex,
 * voltar para esta tela e encontrar a escolha de pé.
 *
 * Só o índice do seletor aberto é estado local — é informação de interface, que
 * não precisa sobreviver a nada.
 */
export default function CompareView({ compare, onOpenPokemon, onGoToPokedex }) {
  const [picking, setPicking] = useState(null);
  const [a, b] = compare.pair;

  const result = a && b ? comparePokemon(a, b) : null;

  return (
    <div className="compare-view">
      <header className="compare-view__head panel">
        <div>
          <p className="eyebrow">Comparação direta</p>
          <h2 className="compare-view__title">Dois Pokémon, atributo por atributo</h2>
          <p className="compare-view__lead">
            Escolha dois Pokémon e veja a diferença de cada um dos seis atributos e do
            total. Você também pode marcar os candidatos pelo botão de balança nos cards
            da Pokédex.
          </p>
        </div>

        <div className="compare-view__head-actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={compare.swap}
            disabled={!a && !b}
          >
            <Icon name="layers" size={15} />
            Inverter lados
          </button>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={compare.clear}
            disabled={compare.count === 0}
          >
            <Icon name="trash" size={15} />
            Limpar
          </button>
        </div>
      </header>

      <div className="compare-view__slots">
        <CompareSlot
          pokemon={a}
          side="a"
          winner={result?.overall === "a"}
          onPick={() => setPicking(0)}
          onClear={() => compare.setSlot(0, null)}
        />

        <div className="compare-view__versus" aria-hidden="true">
          <span>VS</span>
        </div>

        <CompareSlot
          pokemon={b}
          side="b"
          winner={result?.overall === "b"}
          onPick={() => setPicking(1)}
          onClear={() => compare.setSlot(1, null)}
        />
      </div>

      {result ? (
        <>
          <CompareTable a={a} b={b} />

          <div className="compare-view__links">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onOpenPokemon(a.id)}
            >
              Ver dossiê de {a.name}
              <Icon name="arrowRight" size={15} />
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onOpenPokemon(b.id)}
            >
              Ver dossiê de {b.name}
              <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          icon="scales"
          title={
            compare.count === 1
              ? "Falta escolher o segundo Pokémon"
              : "Escolha dois Pokémon para comparar"
          }
          description="A tabela de comparação aparece quando os dois lados estiverem preenchidos."
          actions={[
            {
              label: compare.count === 1 ? "Escolher o segundo" : "Escolher o primeiro",
              onClick: () => setPicking(compare.slots[0] ? 1 : 0),
              primary: true,
              icon: "plus",
            },
            { label: "Procurar na Pokédex", onClick: onGoToPokedex, icon: "pokeball" },
          ]}
        />
      )}

      <PokemonPicker
        open={picking !== null}
        title={picking === 0 ? "Escolher o primeiro Pokémon" : "Escolher o segundo Pokémon"}
        excludeId={picking === 0 ? compare.slots[1] : compare.slots[0]}
        onClose={() => setPicking(null)}
        onSelect={(id) => compare.setSlot(picking, id)}
      />
    </div>
  );
}
