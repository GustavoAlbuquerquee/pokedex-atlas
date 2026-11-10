import { TOTAL_POKEMON } from "../config/appConfig";
import { allPokemon, allTrainers, allTypes } from "../services/pokedexRepository";
import PokedexBrowser from "../components/pokemon/PokedexBrowser";
import Icon from "../components/ui/Icon";
import "./PokedexView.css";

const POKEMON = allPokemon();

/**
 * Tela principal: a Pokédex completa.
 *
 * Acima da barra de ferramentas fica um painel de abertura com a identidade do
 * projeto e os três números que situam o usuário no acervo. Abaixo, o
 * `PokedexBrowser`, que é o mesmo componente usado em Favoritos.
 */
export default function PokedexView({ onRandom, ...browserProps }) {
  return (
    <div className="pokedex-view">
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />

        <div className="hero__text">
          <p className="eyebrow">Arquivo de Kanto · Geração I</p>
          <h2 className="hero__title">
            Os <span className="brand-text">{TOTAL_POKEMON}</span> registros, com
            atributos, tipos e treinadores
          </h2>
          <p className="hero__lead">
            Pesquise por nome ou número, combine filtros de tipo, ordene por qualquer
            atributo e abra o dossiê completo de cada Pokémon. Todos os dados vêm do
            arquivo <code>pokedex-data.json</code> da atividade.
          </p>

          <button type="button" className="btn btn--primary" onClick={onRandom}>
            <Icon name="dice" size={16} />
            Sortear um Pokémon
          </button>
        </div>

        <dl className="hero__stats">
          <div>
            <dt>Pokémon</dt>
            <dd className="numeric">{POKEMON.length}</dd>
          </div>
          <div>
            <dt>Tipos</dt>
            <dd className="numeric">{allTypes().length}</dd>
          </div>
          <div>
            <dt>Treinadores</dt>
            <dd className="numeric">{allTrainers().length}</dd>
          </div>
        </dl>
      </section>

      <PokedexBrowser baseList={POKEMON} {...browserProps} />
    </div>
  );
}
