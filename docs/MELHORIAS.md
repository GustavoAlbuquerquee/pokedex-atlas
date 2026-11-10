# Melhorias implementadas

Comparação entre o projeto de referência da disciplina e o **Pokédex Atlas**.
A análise que originou esta lista está em [ANALISE-PROJETO-ORIGINAL.md](ANALISE-PROJETO-ORIGINAL.md).

---

## 1. Funcionalidade

| # | Melhoria | Situação antes | Situação agora |
| - | -------- | -------------- | -------------- |
| 1.1 | **Favoritos sem serviço externo** | Dependiam do Supabase: sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env.local`, a aba mostrava "Favoritos desativados" | `localStorage`, funcionando no primeiro `npm run dev`, sem configuração nem conta em serviço nenhum |
| 1.2 | **Comparação entre dois Pokémon** | Não existia (é um desafio opcional do enunciado) | Tela própria com barras divergentes, placar de atributos vencidos, diferença numérica e escolha persistida |
| 1.3 | **Painel de estatísticas** | Não existia | Distribuição por tipo, médias dos seis atributos, recordistas e números gerais do acervo |
| 1.4 | **Filtro por vários tipos** | Um tipo por vez | Vários tipos, com modo **E** (tem todos) e **OU** (tem algum); o controle só aparece a partir do segundo tipo |
| 1.5 | **Visão em lista** | Só a grade de cards | Grade **ou** lista com os seis atributos em colunas alinhadas, melhor para comparar muitos de uma vez; a escolha é guardada |
| 1.6 | **Histórico de pesquisas** | Não existia | Os últimos seis termos que *encontraram* algo, exibidos ao focar o campo vazio |
| 1.7 | **Endereços compartilháveis** | Estado só em memória: recarregar voltava ao início | `#/treinadores/1`, `#/pokemon/25`, `#/estatisticas`… — o estado sobrevive ao recarregar e o "voltar" do navegador funciona |
| 1.8 | **Tela "Sobre"** | Não existia | Autoria, escopo, decisões técnicas e créditos das fontes externas |

---

## 2. Arquitetura e código

| # | Melhoria | Situação antes | Situação agora |
| - | -------- | -------------- | -------------- |
| 2.1 | **`App.jsx` enxuto** | 335 linhas, 8 `useState` e 2 `useRef`, misturando animação da capa, abas, seleção, filtros e devolução de foco | Composição, estado global e navegação; o resto desceu para hooks e telas |
| 2.2 | **Camadas explícitas** | `model` / `services` / `hooks`, com a lógica de dados concentrada num arquivo | `domain` → `services` (repositório, consulta e análise, separados) → `hooks` → `components`/`views` |
| 2.3 | **Repositório com índices** | Varredura da lista a cada consulta por treinador | `Map` por ID e índice reverso "Pokémon → treinadores" montados uma vez, na carga do módulo |
| 2.4 | **Reutilização real** | Pokédex e Favoritos repetiam a montagem da barra de ferramentas | Um `PokedexBrowser` serve as duas telas; `SearchField` serve a Pokédex **e** o seletor da comparação, usando a mesma `filterPokemon` |
| 2.5 | **Rede de segurança** | Sem `ErrorBoundary`: erro de renderização deixava a página em branco | `ErrorBoundary` com mensagem, detalhe técnico e botão de recuperação |
| 2.6 | **Dependências** | `@supabase/supabase-js` no bundle | Só `react` e `react-dom`; rotas e ícones são do próprio projeto |

---

## 3. Desempenho

| # | Melhoria | Situação antes | Situação agora |
| - | -------- | -------------- | -------------- |
| 3.1 | **Carregamento progressivo** | 151 cards × 6 barras ≈ 900 barras montadas de uma vez | 36 por vez, crescendo por `IntersectionObserver`, com botão "Carregar mais" para quem usa teclado |
| 3.2 | **Redesenho isolado** | — | `memo` nos cards e `useCallback`/`useMemo` nos manipuladores e na ordem visível: favoritar redesenha **um** card |
| 3.3 | **Imagens sob demanda** | — | `loading="lazy"` fora das primeiras posições e transição de entrada quando a imagem chega |

---

## 4. Interface e identidade visual

| # | Melhoria | Situação antes | Situação agora |
| - | -------- | -------------- | -------------- |
| 4.1 | **Identidade própria** | Aparelho Pokédex desenhado em CSS, com capa e dois skins | Produto digital próprio: marca "Pokédex Atlas", paleta própria de três cores (preto, cobalto e lima), tipografia Sora + Inter, ícones SVG desenhados no projeto |
| 4.2 | **Uso da tela** | A moldura do aparelho encaixotava o conteúdo; os detalhes precisavam de *container queries* de altura só para caber | Navegação lateral + conteúdo em largura total; no dossiê, a arte fica fixa e só a coluna de dados rola |
| 4.3 | **Sistema de tokens** | Cores e medidas espalhadas pelos CSS dos componentes | `styles/tokens.css` como fonte única de cor, tipografia, espaçamento, raio, sombra e tempo; nenhum componente escreve valor literal |
| 4.4 | **Paleta de tipos** | Paleta padrão | Paleta própria, calibrada para os dois temas, com a cor de texto escolhida por contraste WCAG e a cor exposta como `rgb` para transparências |
| 4.5 | **Cards mais informativos** | Número, nome, tipos e barras | O mesmo, mais aura na cor do tipo (degradê entre as duas, no tipo duplo), total em destaque e ações que aparecem no hover — e ficam sempre visíveis no toque |
| 4.6 | **Dossiê mais completo** | Atributos, total, ponto forte e treinadores | Acrescenta ponto fraco, média, posição de **cada** atributo entre os 151 e tipos clicáveis que filtram a Pokédex |
| 4.7 | **Estados vazios** | Três mensagens | Mensagens específicas por causa — inclusive a combinação **E** impossível, que sugere trocar para **OU** |
| 4.8 | **Tema claro de verdade** | Mesmo desenho com cores mais claras | Variáveis próprias de brilho, reflexo e intensidade da aura, para o desenho funcionar nos dois temas |
| 4.9 | **Paleta de marca com contraste verificado** | — | Três cores (preto `#030407`, cobalto `#1558c9`, lima `#d4ff24`) com cada papel medido na aplicação: nenhum texto abaixo de 4,5:1 em nenhum dos dois temas |

---

## 5. Acessibilidade

| # | Melhoria |
| - | -------- |
| 5.1 | Link "Ir para o conteúdo", visível ao receber foco |
| 5.2 | Modal que trava a rolagem compensando a barra, prende o `Tab`, fecha no `Esc` e devolve o foco ao elemento que o abriu |
| 5.3 | `aria-pressed` nas chips de tipo, favoritos e balança; `aria-current` na navegação; `aria-live` na contagem |
| 5.4 | Rótulos que dizem o que o clique faz ("Adicionar Pikachu aos favoritos") |
| 5.5 | Comparação como `<table>` de verdade, com `<th scope="row">` e `<caption>` |
| 5.6 | Ordenação em `<select>` nativo — teclado, leitor de tela e roleta do sistema no celular de graça |
| 5.7 | `prefers-reduced-motion: reduce` desliga animações e transições |
| 5.8 | Contraste do texto auxiliar elevado a ~4,5:1 nos dois temas |

---

## 6. Robustez

| # | Melhoria |
| - | -------- |
| 6.1 | Todo acesso ao `localStorage` protegido por `try/catch` (aba anônima e armazenamento bloqueado lançam exceção) |
| 6.2 | Valores corrompidos no armazenamento são saneados na leitura, em vez de derrubar a tela |
| 6.3 | Imagens com **lista** de endereços candidatos e queda final para SVG local — a aplicação funciona offline |
| 6.4 | Sincronia entre abas pelo evento `storage` |
| 6.5 | `oxlint` sem erros e sem avisos; build de produção sem avisos |

---

## 7. Documentação

| # | Melhoria |
| - | -------- |
| 7.1 | README com descrição, instruções de execução, estrutura comentada, capturas e créditos |
| 7.2 | Análise do projeto de referência, com diagnóstico e plano de evolução |
| 7.3 | Documentação de arquitetura, com as decisões técnicas e seus porquês |
| 7.4 | Matriz de conformidade item a item com o enunciado |
| 7.5 | Relatório de testes com resultados reais e os 16 defeitos encontrados e corrigidos |
| 7.6 | Comentários no código explicando **por que** cada decisão foi tomada, não o que a linha faz |

---

## O que foi deliberadamente **não** feito

- **Trocar de tecnologia.** A atividade exige React + Vite.
- **Substituir os dados por uma API.** O `pokedex-data.json` é a fonte obrigatória; a
  PokéAPI entra só como imagem.
- **Recriar o aparelho Pokédex em CSS.** É a identidade do projeto de referência, e a
  atividade pede identidade própria.
- **Adicionar recursos para aumentar a contagem.** Cada extra responde a uma pergunta
  que o usuário faz de verdade com esses dados: "quem é mais forte?", "quantos são de
  Fogo?", "quem tem este Pokémon no time?".
- **Biblioteca de rotas e de ícones.** Três níveis de rota e trinta ícones não
  justificam duas dependências; ambos são do próprio projeto.
