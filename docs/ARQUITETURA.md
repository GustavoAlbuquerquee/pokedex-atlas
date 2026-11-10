# Arquitetura e decisões técnicas

Pokédex Atlas — React + Vite
Desenvolvido por Gustavo Albuquerque

---

## 1. Visão geral

A aplicação não tem back-end. O `pokedex-data.json` é importado como módulo e empacotado
no bundle pelo Vite; a partir daí tudo acontece no navegador.

```text
pokedex-data.json
        │
        ▼
   ┌─────────┐   objetos congelados, com campos derivados
   │ domain  │   (número formatado, total, cor do tipo, URLs)
   └────┬────┘
        ▼
   ┌──────────┐  carga única + índices (Map por ID, tipos em uso,
   │ services │  treinadores por Pokémon) e as regras de pesquisa,
   └────┬─────┘  filtro, ordenação e análise
        ▼
   ┌───────┐     estado reutilizável: filtros, favoritos, tema,
   │ hooks │     comparação, histórico, rota, lista progressiva
   └───┬───┘
       ▼
 ┌────────────┐  componentes burros + telas
 │ components │
 │   views    │
 └────────────┘
```

A regra que organiza tudo: **quem está acima não conhece quem está abaixo**. O `domain`
não importa React; os `services` não importam React; os componentes não leem o JSON.

---

## 2. Camadas

### 2.1 `domain/` — o dado cru vira objeto de tela

`createPokemon(raw)` e `createTrainer(raw, find)` recebem o objeto do JSON e devolvem um
objeto **congelado** (`Object.freeze`) com os campos originais mais o que é derivado
deles: número com três dígitos, soma dos atributos, nome normalizado para pesquisa e as
URLs das imagens. Congelar é uma escolha deliberada — como os dados são a fonte de
verdade da atividade, nenhuma parte da interface pode alterá-los por engano.

`pokemonTypes.js` guarda a paleta da identidade visual. Cada tipo ganha:

- `label` — nome em pt-BR (o `name` em inglês continua sendo a chave do filtro);
- `color` — a cor da marca para aquele tipo;
- `ink` — a cor de texto escolhida por **contraste WCAG**: a função calcula a luminância
  relativa da cor e compara o contraste do branco e do quase-preto sobre ela, ficando
  com o maior. É por isso que a chip de "Elétrico" (amarelo) usa texto escuro e a de
  "Dragão" (roxo) usa texto branco, sem nenhuma exceção escrita à mão;
- `rgb` — a cor como `"255 107 53"`, para alimentar variáveis CSS e permitir
  `rgb(var(--type-rgb) / 34%)` no lugar de uma segunda cor para cada transparência.

### 2.2 `services/` — regras de negócio

| Arquivo | Responsabilidade |
| ------- | ---------------- |
| `pokedexRepository.js` | Única porta de entrada dos dados. Monta, na carga do módulo: a lista ordenada, um `Map` por ID, os treinadores com os Pokémon já resolvidos, os tipos **em uso** e o índice reverso "Pokémon → treinadores". Consultas viram leituras O(1). |
| `pokedexQuery.js` | `filterPokemon`, `sortPokemon`, `countByType` e a lista de campos de ordenação. Funções puras: recebem lista, devolvem lista. |
| `pokedexInsights.js` | Posições (`rankOf`), ponto forte e fraco, Pokémon do mesmo tipo, médias, distribuição por tipo, recordistas e `comparePokemon`. |

Nada aqui conhece React, o que torna as regras testáveis isoladamente e reutilizáveis —
o seletor do comparador, por exemplo, usa **a mesma** `filterPokemon` da Pokédex, e não
uma segunda implementação parecida.

### 2.3 `hooks/` — estado reutilizável

| Hook | O que resolve |
| ---- | ------------- |
| `useLocalStorage` | Persistência com `try/catch` em toda leitura e escrita (aba anônima e armazenamento bloqueado lançam exceção) e escuta do evento `storage`, para duas abas ficarem em sincronia. Os conversores são constantes de módulo (`JSON_CODEC`, `TEXT_CODEC`) para não recriar objetos a cada render. |
| `usePokedexQuery` | Pesquisa, filtro por tipo (com modo E/OU) e ordenação de uma lista qualquer. |
| `useFavorites` | IDs no `localStorage` como array, em memória como `Set`. Entradas corrompidas são descartadas na leitura. |
| `useCompare` | Os dois lados da comparação, persistidos. Impede o mesmo Pokémon dos dois lados. |
| `useSearchHistory` | Últimos termos que **encontraram** algo. |
| `useTheme` | Tema claro/escuro, sincronizado com o `data-theme` que o `index.html` já aplicou. |
| `useHashRoute` | Rota a partir do hash, com `navigate` (empilha histórico) e `replace` (não empilha). |
| `useProgressiveList` | Fatia visível da lista, crescida por `IntersectionObserver`. |
| `useKeyboardShortcut` | Atalho global que não rouba a digitação de campos de texto (exceto `Esc`). |

### 2.4 `components/` e `views/`

`components/ui` são peças genéricas sem conhecimento de Pokémon (`Icon`, `Modal`,
`StatBar`, `TypeBadge`, `SegmentedControl`, `EmptyState`, `SmartImage`,
`FavoriteButton`). As pastas `pokemon`, `trainers`, `compare` e `insights` são os
componentes de domínio. `views/` tem uma tela por arquivo.

`App.jsx` ficou com três responsabilidades e nada mais: compor as telas, segurar o
estado que é de fato global (tema, favoritos, comparação, histórico, rota) e definir a
navegação.

---

## 3. Decisões técnicas e os porquês

### Estado derivado em `useMemo`, nunca em `useState`

A lista exibida **não é guardada**. Ela é recalculada a partir da lista base sempre que
a pesquisa, o filtro ou a ordenação mudam:

```js
const filtered = useMemo(
  () => filterPokemon(baseList, { search, types, typeMode }),
  [baseList, search, types, typeMode],
);
const results = useMemo(() => sortPokemon(filtered, sort), [filtered, sort]);
```

Guardar o resultado em `useState` criaria duas fontes de verdade e o bug clássico dessa
tela: a lista "congelada" num resultado antigo depois de dois filtros em sequência.

### Rotas por hash escritas no projeto

Três níveis de rota (`#/pokedex`, `#/treinadores/3`, `#/pokemon/25`) não justificam uma
dependência de roteador. O hook tem cerca de 40 linhas e traz três vantagens concretas:
o estado sobrevive ao recarregar, o botão "voltar" do navegador funciona, e o build
abre tanto na raiz de um domínio quanto em subpasta, sem servidor reescrevendo caminhos.

O **Pokémon aberto está na URL**; a **ordem** de navegação (o resultado filtrado, ou o
time de um treinador) fica em estado, porque não caberia na URL sem poluí-la. Quando o
Pokémon aberto não pertence à ordem guardada — endereço colado, botão "voltar", clique
num recordista das estatísticas —, a aplicação cai para a Pokédex inteira, em vez de
deixar "anterior/próximo" mortos.

### `memo` nos cards

`PokemonCard` e `PokemonRow` são memorizados, e os manipuladores que descem para eles
são `useCallback` com dependências estáveis. Favoritar um Pokémon redesenha **um** card,
não os 36 da tela. A lista de IDs da ordem visível também é memorizada — sem isso, um
array novo a cada render anularia o `memo`.

### Carregamento progressivo em vez de paginação

Numerar páginas seria estranho numa Pokédex: ninguém procura "a página 3 dos Pokémon".
A grade mostra 36 e cresce quando a sentinela entra na tela, com o botão "Carregar mais"
ao lado para quem navega por teclado. A fatia volta ao tamanho inicial quando a lista
muda — ajuste feito **durante a renderização** (`if (shownList !== list)`), que é o
padrão recomendado pelo React para estado derivado de props, e não num efeito, que
causaria um render extra com a fatia errada.

### Imagens com lista de candidatos

`SmartImage` recebe **uma lista** de URLs. A primeira que falhar cede lugar à próxima e,
esgotadas, entra o SVG local `sem-imagem.svg` ou um conteúdo de reserva (as iniciais do
treinador). É o que garante o requisito de continuar funcionando com a API externa fora
do ar — e também cobre o caso do treinador cujo sprite tem nome diferente no Showdown.

### O `<table>` da comparação é uma tabela de verdade

A comparação é uma tabela de dados, então usa `<table>`, `<th scope="row">` e
`<caption>`: quem usa leitor de tela ouve o nome do atributo junto do valor. O
alinhamento das colunas depende de as células continuarem sendo células — por isso quem
organiza valor e barra é um `<span>` interno, e não um `display: flex` na própria `<td>`
(que tiraria a célula do contexto de tabela e desalinharia tudo).

### Acessibilidade

- Link "Ir para o conteúdo", visível ao receber foco.
- Foco visível e consistente (`:focus-visible` com anel na cor de foco).
- `Modal`: trava a rolagem do fundo compensando a barra de rolagem, prende o `Tab`
  dentro do painel, fecha no `Esc` e **devolve o foco** ao elemento que o abriu.
- `aria-pressed` nas chips de tipo, nos favoritos e na balança da comparação;
  `aria-current="page"` na navegação; `aria-live="polite"` na contagem de resultados.
- Rótulos que dizem o que o clique faz ("Adicionar Pikachu aos favoritos"), não "Favoritar".
- `prefers-reduced-motion: reduce` desliga animações e transições.

### Robustez

- `ErrorBoundary` em volta da aplicação — único componente de classe, porque
  `componentDidCatch` não tem equivalente em hooks.
- Todo acesso ao `localStorage` protegido.
- Valores corrompidos no armazenamento são saneados na leitura, não derrubam a tela.

---

## 4. Sistema de design

### Tokens

`styles/tokens.css` é a fonte única de cor, tipografia, espaçamento, raio, sombra e
tempo. Nenhum CSS de componente escreve um valor literal de cor ou medida.

- **Tipografia:** **Sora** (títulos, rótulos e interface) e **Inter** (texto), com
  escala fluida em `clamp()` — funciona de 360 px a 1920 px sem media query.
- **Espaçamento:** base de 4 px, de `--space-1` a `--space-20`.
- **Movimento:** quatro durações e quatro curvas, entre elas uma com leve excesso
  (`--ease-spring`) para microinterações de botão.
- **Marca:** degradê carmim → âmbar, igual nos dois temas.

### Os dois temas

O tema escuro é o padrão. Cada tema redefine o mesmo conjunto de variáveis, incluindo
três que existem só para o desenho funcionar nos dois:

- `--rim-light` — o brilho interno que dá volume aos cards no escuro e vira um realce
  branco no claro;
- `--card-sheen` — o degradê de topo da superfície;
- `--aura-strength` — a intensidade do halo colorido do tipo, mais contida no tema claro.

O tema é aplicado no `index.html` **antes** de o React montar, lendo `localStorage` e,
na primeira visita, a preferência do sistema. Sem isso a página abriria escura e piscaria
para o claro. O `useTheme` lê esse mesmo valor de volta, então HTML e React nunca
discordam.

### Responsividade

| Faixa | Layout |
| ----- | ------ |
| ≥ 1200 px | Navegação lateral completa, grade de cards em 3–4 colunas |
| 1000–1200 px | Lateral só com ícones |
| ≤ 1000 px | Lateral sai, entra a barra inferior; conteúdo em largura total |
| ≤ 900 px | Dossiê empilha arte e dados |
| ≤ 760 px | Modal vira folha que sobe de baixo; chips de tipo viram faixa com rolagem |
| ≤ 560 px | Grade em uma coluna, destaques do dossiê em duas colunas |

Detalhes que só aparecem no uso real e estão cobertos: o campo de pesquisa usa
`font-size: 16px` (abaixo disso o iOS dá zoom ao focar), as ações do card ficam sempre
visíveis em telas sem `hover`, e a barra inferior respeita `env(safe-area-inset-bottom)`.

---

## 5. Build

`vite.config.js` usa `base: "./"`, o que gera caminhos relativos e permite publicar na
raiz de um domínio, numa subpasta (GitHub Pages) ou abrir o `dist/index.html` direto do
disco — as rotas por hash funcionam nos três casos.

Build de produção: **319 kB de JS (94 kB em gzip)** e **71 kB de CSS (12 kB em gzip)**,
sem nenhuma dependência além de `react` e `react-dom`.
