import { useMemo } from "react";
import MetricTile from "../components/insights/MetricTile";
import RecordBoard from "../components/insights/RecordBoard";
import TypeDistribution from "../components/insights/TypeDistribution";
import StatBar from "../components/ui/StatBar";
import { STATS } from "../domain/stats";
import {
  datasetOverview,
  recordHolders,
  typeDistribution,
} from "../services/pokedexInsights";
import { allPokemon } from "../services/pokedexRepository";
import { decimal, plural } from "../utils/text";
import "./StatsView.css";

const POKEMON = allPokemon();

/**
 * Painel de estatísticas do acervo.
 *
 * Tudo nesta tela é calculado a partir do `pokedex-data.json` — contagens,
 * médias, distribuição por tipo e recordistas. Serve a dois propósitos: dá uma
 * leitura de conjunto que card nenhum dá, e é a prova visível de que os dados
 * estão sendo lidos por inteiro.
 */
export default function StatsView({ favoriteCount, onSelectType, onOpenPokemon }) {
  const overview = useMemo(() => datasetOverview(), []);
  const distribution = useMemo(() => typeDistribution(POKEMON), []);
  const records = useMemo(() => recordHolders(POKEMON), []);

  // Escala das barras: a média mais alta arredondada para a dezena seguinte.
  // Usar a própria média máxima deixaria todas as barras quase cheias; usar 255
  // (a escala real do atributo) deixaria todas quase vazias.
  const maxAverage = Math.max(...STATS.map((stat) => overview.averages[stat.key]));
  const averageScale = Math.ceil(maxAverage / 10) * 10;

  return (
    <div className="stats-view">
      <section className="stats-view__tiles" aria-label="Números gerais">
        <MetricTile
          icon="pokeball"
          label="Pokémon"
          value={overview.pokemonCount}
          hint="Todos os registros do arquivo de dados"
          accent
        />
        <MetricTile
          icon="layers"
          label="Tipos em uso"
          value={overview.typeCount}
          hint={`${overview.dualTypeCount} de tipo duplo, ${overview.singleTypeCount} de tipo único`}
        />
        <MetricTile
          icon="users"
          label="Treinadores"
          value={overview.trainerCount}
          hint={`${overview.badgeTotal} insígnias somadas`}
        />
        <MetricTile
          icon="badge"
          label="Em algum time"
          value={overview.ownedCount}
          hint={`${overview.pokemonCount - overview.ownedCount} não aparecem em time nenhum`}
        />
        <MetricTile
          icon="chart"
          label="Total médio"
          value={decimal(overview.averages.total)}
          hint="Soma dos seis atributos, média dos 151"
        />
        <MetricTile
          icon="star"
          label="Seus favoritos"
          value={favoriteCount}
          hint={
            favoriteCount === 0
              ? "Marque a estrela de um Pokémon para começar"
              : `${plural(favoriteCount, "Pokémon", "Pokémon")} salvos neste navegador`
          }
        />
      </section>

      <div className="stats-view__columns">
        <section className="stats-view__panel panel" aria-labelledby="dist-title">
          <header className="stats-view__panel-head">
            <h2 id="dist-title">Distribuição por tipo</h2>
            <p>
              Quantos dos {overview.pokemonCount} Pokémon têm cada tipo. Pokémon de tipo
              duplo contam nos dois. Clique em um tipo para filtrar a Pokédex.
            </p>
          </header>

          <TypeDistribution distribution={distribution} onSelectType={onSelectType} />
        </section>

        <section className="stats-view__panel panel" aria-labelledby="avg-title">
          <header className="stats-view__panel-head">
            <h2 id="avg-title">Média de cada atributo</h2>
            <p>
              Média entre os {overview.pokemonCount} Pokémon. As barras usam a escala de 0
              a {averageScale}, para a diferença entre os atributos ficar visível.
            </p>
          </header>

          <div className="stats-view__averages">
            {STATS.map((stat, index) => (
              <StatBar
                key={stat.key}
                stat={stat}
                value={Math.round(overview.averages[stat.key])}
                color="var(--accent)"
                variant="full"
                max={averageScale}
                delay={index * 60}
                showIcon
              />
            ))}
          </div>
        </section>
      </div>

      <section className="stats-view__panel panel" aria-labelledby="records-title">
        <header className="stats-view__panel-head">
          <h2 id="records-title">Recordistas</h2>
          <p>
            O maior valor de cada atributo entre os {overview.pokemonCount} Pokémon. Clique
            para abrir o dossiê.
          </p>
        </header>

        <RecordBoard records={records} onOpenPokemon={onOpenPokemon} />
      </section>
    </div>
  );
}
