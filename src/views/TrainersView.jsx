import { useEffect, useMemo, useState } from "react";
import TrainerCard from "../components/trainers/TrainerCard";
import Icon from "../components/ui/Icon";
import SegmentedControl from "../components/ui/SegmentedControl";
import { allTrainers } from "../services/pokedexRepository";
import "./TrainersView.css";

const TRAINERS = allTrainers();

const SORT_OPTIONS = [
  { value: "id", label: "Ordem do arquivo" },
  { value: "badges", label: "Insígnias" },
  { value: "team", label: "Tamanho do time" },
];

/**
 * Área dos treinadores.
 *
 * Mostra os 12 treinadores do `pokedex-data.json` com nome, insígnias e o time
 * — todos relacionamentos que já existem no arquivo. Nenhum vínculo é inventado
 * e nenhum treinador é omitido.
 *
 * `highlightId` vem da rota (`#/treinadores/3`): quando o usuário chega pelo
 * link "ver treinador" dos detalhes de um Pokémon, o card certo recebe foco e
 * destaque, em vez de deixar a pessoa procurando na lista.
 */
export default function TrainersView({ highlightId, onOpenPokemon }) {
  const [sort, setSort] = useState("id");

  const trainers = useMemo(() => {
    const list = [...TRAINERS];
    if (sort === "badges") return list.sort((a, b) => b.badges - a.badges || a.id - b.id);
    if (sort === "team") return list.sort((a, b) => b.teamSize - a.teamSize || a.id - b.id);
    return list.sort((a, b) => a.id - b.id);
  }, [sort]);

  useEffect(() => {
    if (!highlightId) return;
    const card = document.getElementById(`trainer-${highlightId}`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.focus({ preventScroll: true });
  }, [highlightId]);

  const totalBadges = TRAINERS.reduce((sum, trainer) => sum + trainer.badges, 0);
  const totalSlots = TRAINERS.reduce((sum, trainer) => sum + trainer.teamSize, 0);

  return (
    <div className="trainers-view">
      <header className="trainers-view__head panel">
        <div>
          <p className="eyebrow">Treinadores do arquivo de dados</p>
          <h2 className="trainers-view__title">
            {TRAINERS.length} treinadores, {totalBadges} insígnias e {totalSlots} vagas de time
          </h2>
          <p className="trainers-view__lead">
            Cada card traz os Pokémon que o <code>pokedex-data.json</code> associa àquele
            treinador,
            na ordem do arquivo. Clique em um Pokémon do time para abrir o dossiê dele —
            as setas de navegação andam pelo time daquele treinador.
          </p>
        </div>

        <SegmentedControl
          label="Ordenar treinadores"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
      </header>

      <ul className="trainers-view__grid">
        {trainers.map((trainer) => (
          <TrainerCard
            key={trainer.id}
            trainer={trainer}
            highlighted={Number(highlightId) === trainer.id}
            onOpenPokemon={onOpenPokemon}
          />
        ))}
      </ul>

      <p className="trainers-view__note">
        <Icon name="info" size={15} />
        As imagens dos treinadores vêm dos sprites públicos do Pokémon Showdown. Quando
        uma imagem não carrega, o card mostra as iniciais — os dados continuam completos.
      </p>
    </div>
  );
}
