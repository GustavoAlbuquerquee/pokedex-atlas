import { APP, CREDITS } from "../config/appConfig";
import Icon from "../components/ui/Icon";
import "./AboutView.css";

const FEATURES = [
  {
    icon: "pokeball",
    title: "Pokédex completa",
    text: "Os 151 Pokémon do arquivo de dados, cada um com número, nome, tipos e os seis atributos base.",
  },
  {
    icon: "search",
    title: "Pesquisa por nome ou número",
    text: "A lista responde a cada tecla. Aceita “bulba”, “25”, “#025” e ignora acentos e pontuação.",
  },
  {
    icon: "layers",
    title: "Filtro por tipo combinável",
    text: "Chips com a cor e a contagem de cada tipo, com combinação E/OU para vários tipos ao mesmo tempo.",
  },
  {
    icon: "chart",
    title: "Dossiê detalhado",
    text: "Barras de atributos, posição de cada atributo entre os 151, ponto forte, ponto fraco e treinadores.",
  },
  {
    icon: "users",
    title: "Treinadores e insígnias",
    text: "Os 12 treinadores do arquivo, com insígnias e time — exatamente os vínculos que existem nos dados.",
  },
  {
    icon: "scales",
    title: "Comparação e estatísticas",
    text: "Dois Pokémon lado a lado, mais um painel com distribuição por tipo, médias e recordistas.",
  },
];

const EXTRAS = [
  "Favoritos salvos no localStorage, com tela própria e os mesmos filtros",
  "Comparação entre dois Pokémon, com placar e diferença por atributo",
  "Ordenação por número, nome, total e cada um dos seis atributos",
  "Pokémon aleatório, que abre o dossiê direto",
  "Tema claro e escuro, com a preferência guardada e sem piscar ao carregar",
  "Responsividade de desktop a celular, com navegação inferior no toque",
  "Carregamento progressivo da grade e histórico das últimas pesquisas",
  "Rotas por hash: cada tela e cada Pokémon têm endereço próprio e compartilhável",
];

/**
 * Tela Sobre: autoria, escopo, fontes externas e decisões técnicas.
 *
 * Existe porque um projeto de portfólio tem de dizer quem fez, o que usa e de
 * onde vêm os dados. É também onde fica a documentação das fontes externas que a
 * atividade pede que sejam declaradas.
 */
export default function AboutView() {
  return (
    <div className="about-view">
      <section className="about-view__intro panel">
        <div className="about-view__glow" aria-hidden="true" />

        <p className="eyebrow">Sobre o projeto</p>
        <h2 className="about-view__title">
          {APP.name} — <span className="brand-text">{APP.tagline}</span>
        </h2>

        <p className="about-view__lead">
          Aplicação React + Vite construída como resposta à {APP.activity} da disciplina{" "}
          {APP.course}. Toda a informação exibida vem do arquivo{" "}
          <code>src/data/pokedex-data.json</code>, fornecido na atividade e mantido
          íntegro: nenhum atributo foi inventado, nenhum treinador removido e nenhum
          relacionamento alterado.
        </p>

        <dl className="about-view__identity">
          <div>
            <dt>Desenvolvido por</dt>
            <dd>{APP.author}</dd>
          </div>
          <div>
            <dt>Disciplina</dt>
            <dd>{APP.course}</dd>
          </div>
          <div>
            <dt>Atividade</dt>
            <dd>{APP.activity}</dd>
          </div>
          <div>
            <dt>Professor</dt>
            <dd>{APP.professor}</dd>
          </div>
          <div>
            <dt>Versão</dt>
            <dd className="numeric">{APP.version}</dd>
          </div>
        </dl>
      </section>

      <section className="about-view__block panel" aria-labelledby="features-title">
        <h3 id="features-title">O que a aplicação faz</h3>
        <ul className="about-view__features">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <span className="about-view__feature-icon" aria-hidden="true">
                <Icon name={feature.icon} size={18} />
              </span>
              <div>
                <strong>{feature.title}</strong>
                <p>{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-view__block panel" aria-labelledby="extras-title">
        <h3 id="extras-title">Funcionalidades extras implementadas</h3>
        <ul className="about-view__list">
          {EXTRAS.map((item) => (
            <li key={item}>
              <Icon name="check" size={15} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-view__block panel" aria-labelledby="stack-title">
        <h3 id="stack-title">Como está construído</h3>
        <ul className="about-view__list">
          <li>
            <Icon name="check" size={15} />
            React 19 com componentes funcionais, props, <code>useState</code>,{" "}
            <code>useEffect</code>, <code>useMemo</code>, <code>useCallback</code> e hooks
            próprios reutilizáveis
          </li>
          <li>
            <Icon name="check" size={15} />
            Vite como build e servidor de desenvolvimento
          </li>
          <li>
            <Icon name="check" size={15} />
            Camadas separadas: <code>domain</code> (modelos), <code>services</code> (regras
            de dados), <code>hooks</code> (estado), <code>components</code> e{" "}
            <code>views</code> (apresentação)
          </li>
          <li>
            <Icon name="check" size={15} />
            CSS próprio com tokens de design, sem framework de UI e sem biblioteca de
            ícones — os ícones são SVG desenhados no projeto
          </li>
          <li>
            <Icon name="check" size={15} />
            Listas renderizadas com <code>map()</code> e estados derivados calculados em{" "}
            <code>useMemo</code>, nunca duplicados em <code>useState</code>
          </li>
        </ul>
      </section>

      <section className="about-view__block panel" aria-labelledby="credits-title">
        <h3 id="credits-title">Fontes e créditos</h3>
        <ul className="about-view__credits">
          {CREDITS.map((credit) => (
            <li key={credit.label}>
              <a href={credit.href} target="_blank" rel="noreferrer noopener">
                {credit.label}
                <Icon name="external" size={14} />
              </a>
              <p>{credit.detail}</p>
            </li>
          ))}
        </ul>

        <p className="about-view__note">
          <Icon name="info" size={15} />
          As imagens são complemento visual. Se a PokéAPI ou o Pokémon Showdown estiverem
          fora do ar, a aplicação continua funcionando com os dados locais e um
          substituto desenhado em SVG. O enunciado, o arquivo de dados e o projeto de
          referência da disciplina são de autoria do professor {APP.professor} e estão
          publicados sob licença MIT; o código desta aplicação foi escrito por{" "}
          {APP.author}.
        </p>
      </section>
    </div>
  );
}
