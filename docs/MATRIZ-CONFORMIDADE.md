# Matriz de conformidade — Atividade 03

Confronto item a item entre o enunciado
([ATIVIDADE 03.md](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md))
e o que está implementado no Pokédex Atlas.

Legenda: ✅ atendido · ⭐ extra além do pedido

---

## 1. Tecnologia e organização

| # | Requisito do enunciado | Situação | Onde está |
| - | ---------------------- | -------- | --------- |
| 1.1 | Aplicação desenvolvida com **React + Vite** | ✅ | React 19.3 e Vite 8.3 — `package.json`, `vite.config.js` |
| 1.2 | Organização adequada do projeto | ✅ | Camadas `domain` / `services` / `hooks` / `components` / `views` — [ARQUITETURA.md](ARQUITETURA.md) |
| 1.3 | Pasta `src/data` com o arquivo de dados | ✅ | `src/data/pokedex-data.json` |
| 1.4 | Componentes organizados em pastas | ✅ | `src/components/{ui,layout,pokemon,trainers,compare,insights}` |
| 1.5 | CSS organizado | ✅ | CSS colocalizado por componente + `src/styles/tokens.css` e `base.css` |
| 1.6 | Bibliotecas adicionais registradas no `package.json` | ✅ | Nenhuma além de `react` e `react-dom`; ícones e rotas são do próprio projeto |

## 2. Conceitos de React exigidos

| # | Requisito | Situação | Onde está |
| - | --------- | -------- | --------- |
| 2.1 | **Componentes funcionais** | ✅ | Todos; a única classe é `ErrorBoundary`, que precisa de `componentDidCatch` |
| 2.2 | **Props** | ✅ | `PokemonCard`, `StatBar`, `TrainerCard`, `AppShell`, `CompareSlot`... |
| 2.3 | **`useState`** | ✅ | `usePokedexQuery.js:17-20`, `App.jsx` (contexto do dossiê), `SearchField`, `TrainersView` |
| 2.4 | **Renderização de listas com `map()`** | ✅ | `PokemonCollection.jsx`, `TypeFilterBar.jsx`, `TrainerCard.jsx`, `CompareTable.jsx`, `RecordBoard.jsx` |
| 2.5 | **Eventos** | ✅ | Cliques nos cards, chips e abas; `change` na ordenação; teclado (`Esc`, `←`, `→`); `focus`/`blur` no histórico de pesquisa |
| 2.6 | **Filtragem de dados** | ✅ | `services/pokedexQuery.js` → `filterPokemon` |
| 2.7 | **Componentização adequada** | ✅ | 40 componentes; nenhum passa de ~250 linhas |
| 2.8 | *(recomendado)* **`useEffect`** | ✅ | `useLocalStorage`, `useTheme`, `useProgressiveList`, `Modal`, `TrainersView`, `App` |
| 2.9 | *(recomendado)* **Hooks** | ✅ | Nove hooks próprios em `src/hooks/` |
| 2.10 | *(recomendado)* **Estados derivados** | ✅ | `useMemo` em `usePokedexQuery`, `FavoritesView`, `StatsView`, `PokemonDetails`, `App` |
| 2.11 | *(recomendado)* **Reutilização de componentes** | ✅ | `PokedexBrowser` serve Pokédex e Favoritos; `SearchField` serve a Pokédex e o seletor da comparação; `StatBar` serve card, dossiê e estatísticas |

## 3. Pokédex

| # | Requisito | Situação | Onde está |
| - | --------- | -------- | --------- |
| 3.1 | Tela principal com os Pokémon do arquivo | ✅ | `views/PokedexView.jsx` — 151 registros |
| 3.2 | Exibir **Número/ID** | ✅ | `#001` no card, na linha e no dossiê |
| 3.3 | Exibir **Nome** | ✅ | Card, linha, dossiê, comparação, time do treinador |
| 3.4 | Exibir **Tipo ou tipos** | ✅ | `TypeBadge`, com a cor do tipo |
| 3.5 | Exibir **HP** | ✅ | `STATS[0]` — card, linha e dossiê |
| 3.6 | Exibir **Ataque** | ✅ | `STATS[1]` |
| 3.7 | Exibir **Defesa** | ✅ | `STATS[2]` |
| 3.8 | Exibir **Ataque Especial** | ✅ | `STATS[3]` |
| 3.9 | Exibir **Defesa Especial** | ✅ | `STATS[4]` |
| 3.10 | Exibir **Velocidade** | ✅ | `STATS[5]` |
| 3.11 | Usar componentes React para organizar a interface | ✅ | `AppShell → PokedexView → PokedexBrowser → {SearchField, SortControl, TypeFilterBar, PokemonCollection → PokemonCard}` |

## 4. Pesquisa

| # | Requisito | Situação | Evidência |
| - | --------- | -------- | --------- |
| 4.1 | Campo de pesquisa | ✅ | `components/pokemon/SearchField.jsx` |
| 4.2 | Pesquisa por **ID** | ✅ | `025`, `25`, `#25` e `# 025` → Pikachu (regex `^#?\s*0*(\d{1,3})$`) |
| 4.3 | Pesquisa por **nome** | ✅ | `char` → Charmander, Charmeleon, Charizard |
| 4.4 | Atualiza a lista **conforme o usuário digita** | ✅ | Sem botão "pesquisar": `onChange` → estado → `useMemo` |
| 4.5 | Tratar resultados inexistentes | ✅ | `EmptyState` "Nada encontrado para …" com ação de limpar |
| 4.6 | ⭐ Ignorar acentos e pontuação | ⭐ | `mr mime` → Mr. Mime; `farfetchd` → Farfetch'd |
| 4.7 | ⭐ Histórico das últimas pesquisas | ⭐ | `useSearchHistory`, exibido ao focar o campo vazio |

## 5. Filtro por tipo

| # | Requisito | Situação | Evidência |
| - | --------- | -------- | --------- |
| 5.1 | Permitir filtrar por tipo | ✅ | `components/pokemon/TypeFilterBar.jsx` |
| 5.2 | Usar **os tipos presentes no JSON** | ✅ | `allTypes()` filtra a lista `types` do arquivo pelos que algum Pokémon usa → 17 chips (o tipo `Dark` existe no arquivo mas não é usado) |
| 5.3 | Componente visual à escolha | ✅ | Chips com a cor do tipo e a contagem |
| 5.4 | **Combinar pesquisa e filtros sem conflito** | ✅ | `bulba` + (Planta OU Venenoso) → Bulbasaur; ambos são condições do mesmo `filter` |
| 5.5 | ⭐ Combinar vários tipos | ⭐ | Modo **E** (Planta E Venenoso → 9) e **OU** (Planta OU Venenoso → 38) |

## 6. Detalhes do Pokémon

| # | Requisito | Situação | Onde está |
| - | --------- | -------- | --------- |
| 6.1 | Visualização detalhada ao selecionar | ✅ | `PokemonDetails` em modal (`#/pokemon/:id`) |
| 6.2 | **ID** | ✅ | Chip de posição, número grande de fundo e `#000` |
| 6.3 | **Nome** | ✅ | Título do painel |
| 6.4 | **Tipos** | ✅ | Chips clicáveis que filtram a Pokédex |
| 6.5 | **Imagem** | ✅ | Arte oficial da PokéAPI, com sprite e SVG local como reserva |
| 6.6 | Os **seis atributos** | ✅ | `StatBar` variante completa |
| 6.7 | **Barras de progresso** | ✅ | Escala fixa de 0 a 255, com crescimento escalonado |
| 6.8 | Informações adicionais **disponíveis nos dados** | ✅ | Total, posição de cada atributo entre os 151, ponto forte, ponto fraco, média, treinadores e Pokémon do mesmo tipo |
| 6.9 | ⭐ Navegação anterior/próximo | ⭐ | Segue a ordem **visível** (filtrada ou o time do treinador); setas do teclado |

## 7. Treinadores

| # | Requisito | Situação | Onde está |
| - | --------- | -------- | --------- |
| 7.1 | Área para consultar os treinadores | ✅ | `views/TrainersView.jsx` (`#/treinadores`) |
| 7.2 | **Nome do treinador** | ✅ | 12 treinadores: Ash, Brock, Misty, Lt. Surge, Erika, Koga, Sabrina, Blaine, Giovanni, Gary, Team Rocket, Lance |
| 7.3 | **Quantidade de insígnias** | ✅ | Texto e medidor de insígnias (63 somadas) |
| 7.4 | **Pokémon relacionados** | ✅ | Time completo, na ordem do arquivo, com repetições preservadas (Koga tem três Venonat) |
| 7.5 | **Navegação entre os Pokémon do treinador** | ✅ | Clicar num Pokémon do time abre o dossiê com anterior/próximo **dentro daquele time** |
| 7.6 | Não inventar relacionamentos | ✅ | Só `pokemonIds` do arquivo; o caminho inverso (dossiê → treinador) usa o índice reverso dos mesmos dados |

## 8. Interface

| # | Requisito | Situação | Evidência |
| - | --------- | -------- | --------- |
| 8.1 | **Identidade visual própria** | ✅ | Marca "Pokédex Atlas", paleta própria de três cores (preto `#030407`, cobalto `#1558c9`, lima `#d4ff24`), tokens próprios, tipografia Sora + Inter, ícones desenhados no projeto |
| 8.2 | Cores associadas aos tipos | ✅ | Paleta própria; cor do texto escolhida por contraste WCAG |
| 8.3 | Cards | ✅ | `PokemonCard` com aura do tipo, arte e atributos |
| 8.4 | Gradientes | ✅ | Marca, auras de tipo, preenchimento das barras |
| 8.5 | Animações e transições | ✅ | Entrada escalonada dos cards, crescimento das barras, flutuação da arte, folha que sobe no celular |
| 8.6 | Efeitos de hover | ✅ | Elevação do card, aura ampliada, arte que sobe |
| 8.7 | Barras de atributos | ✅ | Compacta (card), completa (dossiê) e divergente (comparação) |
| 8.8 | Ícones | ✅ | 30 ícones SVG próprios, mesma grade e mesmo traço |
| 8.9 | Imagens dos Pokémon | ✅ | PokéAPI, com reserva local |
| 8.10 | **Layout responsivo** | ✅ | Seis pontos de quebra — ver [ARQUITETURA.md](ARQUITETURA.md#responsividade) |
| 8.11 | **Tema escuro** | ✅ | Padrão escuro, com tema claro completo e preferência guardada |

## 9. Requisitos funcionais

| # | Requisito | Situação |
| - | --------- | -------- |
| 9.1 | Desenvolvida com React + Vite | ✅ |
| 9.2 | Exibir os Pokémon do arquivo de dados | ✅ 151 |
| 9.3 | Pesquisa por nome ou ID | ✅ |
| 9.4 | Filtro por tipo | ✅ |
| 9.5 | Visualizar detalhes | ✅ |
| 9.6 | Exibir os atributos | ✅ |
| 9.7 | Utilizar componentes React | ✅ |
| 9.8 | Utilizar estados e eventos | ✅ |
| 9.9 | Interface responsiva | ✅ |
| 9.10 | **Tratar "nenhum Pokémon encontrado"** | ✅ Três estados vazios distintos, todos com ação |
| 9.11 | Identidade visual própria | ✅ |

## 10. Desafios opcionais

| # | Desafio | Situação | Onde está |
| - | ------- | -------- | --------- |
| 10.1 | **Favoritos** | ✅ | `useFavorites` + `localStorage`; tela própria com os mesmos filtros |
| 10.2 | **Comparação entre dois Pokémon** | ✅ | `views/CompareView.jsx`, com placar e diferença por atributo |
| 10.3 | **Ordenação** (HP, Ataque, Defesa, At.Esp., Def.Esp., Velocidade, Nome, ID) | ✅ | As 8 pedidas + total de atributos = 9 opções, crescente/decrescente |
| 10.4 | **Pokémon aleatório** | ✅ | Botão no painel de abertura e na barra superior |
| 10.5 | **Dark Mode** | ✅ | Com preferência guardada e sem piscar ao carregar |
| 10.6 | **Responsividade avançada** (desktop, tablet, smartphone) | ✅ | Lateral completa → lateral de ícones → barra inferior |
| 10.7 | **API externa** | ✅ | PokéAPI para artes e sprites; Showdown para treinadores, com queda para arquivo local |

## 11. Dados e integridade

| # | Exigência | Situação | Evidência |
| - | --------- | -------- | --------- |
| 11.1 | `pokedex-data.json` como fonte principal | ✅ | Importado em `services/pokedexRepository.js`; nenhuma outra origem de dado |
| 11.2 | Preservar os dados originais | ✅ | Cópia byte a byte da pasta `ATIVIDADES`; objetos congelados em memória |
| 11.3 | Não substituir por API externa | ✅ | A PokéAPI entra só como imagem |
| 11.4 | Não remover treinadores nem relacionamentos | ✅ | 12 treinadores, 43 vagas de time, repetições preservadas |
| 11.5 | Não inventar atributos | ✅ | Tudo que é exibido vem do arquivo ou é **calculado** a partir dele (total, média, posição) |
| 11.6 | Funcionar com a API externa indisponível | ✅ | `SmartImage` com lista de candidatos → `sem-imagem.svg` |
| 11.7 | Documentar as fontes externas | ✅ | README (seção "Fontes externas e créditos") e tela **Sobre** |

## 12. Entrega

| # | Item | Situação | Onde está |
| - | ---- | -------- | --------- |
| 12.1 | Código-fonte completo | ✅ | `src/` — 51 arquivos JS/JSX, 32 CSS |
| 12.2 | Configuração do Vite | ✅ | `vite.config.js` |
| 12.3 | Pokédex funcional | ✅ | Verificada no navegador — [RELATORIO-TESTES.md](RELATORIO-TESTES.md) |
| 12.4 | Sistema de pesquisa | ✅ | |
| 12.5 | Filtro por tipo | ✅ | |
| 12.6 | Visualização de detalhes | ✅ | |
| 12.7 | Exibição dos atributos | ✅ | |
| 12.8 | Arquivo `pokedex-data.json` | ✅ | `src/data/` |
| 12.9 | **`README.md` com documentação** | ✅ | Raiz do projeto |
| 12.10 | **Instruções de execução** | ✅ | README → "Como executar" |
| 12.11 | `package.json` | ✅ | |
| 12.12 | Imagens da aplicação no README | ✅ | 10 capturas em `docs/imagens/` |
| 12.13 | Identificação do desenvolvedor | ✅ | README, tela **Sobre**, rodapé da navegação, `<title>` e meta `author` |

---

## Resultado

**Nenhum requisito obrigatório ficou pendente.** Os sete desafios opcionais foram
implementados, e há funcionalidades além do enunciado (estatísticas do acervo, visão em
lista, histórico de pesquisas, carregamento progressivo, rotas compartilháveis e
filtro por vários tipos).

### Observação sobre a entrega em dupla

O enunciado prevê realização em dupla. Este projeto foi desenvolvido **individualmente
por Gustavo Albuquerque**, e por isso consta apenas essa autoria — nenhuma contribuição
de terceiros foi inventada. Caso a entrega passe a ser em dupla, o nome do segundo
integrante entra na constante `APP` de `src/config/appConfig.js`, de onde a tela
**Sobre** e o rodapé da navegação leem a autoria; o README e esta matriz precisam ser
atualizados à mão.
