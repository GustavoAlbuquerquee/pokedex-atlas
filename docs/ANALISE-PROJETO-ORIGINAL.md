# Análise do projeto de referência e plano de evolução

> Primeira etapa da atividade: inventário, leitura do código-fonte e diagnóstico do
> projeto Pokédex disponibilizado pelo professor, antes de escrever qualquer linha.
>
> Como se trata de uma aplicação React com código-fonte aberto, a análise foi
> **estática, sobre o código**. Nenhuma ferramenta de engenharia reversa de binário
> seria útil aqui: não há binário, há um repositório.

---

## 1. Fontes analisadas

| Item | Endereço |
| ---- | -------- |
| Enunciado | `ATIVIDADES/ATIVIDADE 03.md` |
| Arquivo de dados oficial | `ATIVIDADES/ATIVIDADE 03 - JSON/data/pokedex-data.json` |
| Projeto de referência | `PROJETOS/React/Pokedex` |
| Licença do repositório | MIT — Copyright (c) 2026 João Paulo Aramuni |

O repositório do professor foi clonado em modo esparso (`--filter=blob:none --sparse`)
para uma pasta temporária, trazendo apenas as duas árvores acima.

**Verificação de integridade:** o `pokedex-data.json` dentro do projeto de referência é
**idêntico** ao oficial da pasta `ATIVIDADES` (comparação depois de normalizar e ordenar
as chaves: diferença vazia). O arquivo usado neste projeto é o da pasta `ATIVIDADES`.

---

## 2. Estrutura dos dados

```text
pokedex-data.json
├── types     18 itens   { id, name }
├── pokemon  151 itens   { id, name, stats { hp, attack, defense,
│                          specialAttack, specialDefense, speed }, types[] }
└── trainers  12 itens   { id, name, badges, pokemonIds[] }
```

Particularidades encontradas no arquivo, todas confirmadas lendo os dados:

| Achado | Consequência para a implementação |
| ------ | --------------------------------- |
| O tipo `Typeless` (id 0) existe na lista `types` | É um tipo legítimo do arquivo, não uma invenção |
| **Mew (#151) tem `types: []`** | Precisa receber `Typeless`, senão `types[0]` quebra o card |
| **`pokemonIds` repete**: Koga tem três Venonat (`[48, 48, 48, 49]`) | A `key` da lista não pode ser o ID; e a navegação anterior/próximo precisa desduplicar, senão o botão "próximo" não sai do lugar |
| `Dark` está em `types`, mas nenhum Pokémon o usa | O filtro deve listar só os tipos **em uso** (17), e não os 18 |
| Nenhum campo além de `id`, `name`, `badges` e `pokemonIds` nos treinadores | Qualquer "bioma", "cidade" ou "tipo favorito" seria invenção — e foi descartado |
| 38 Pokémon distintos aparecem em algum time | Os outros 113 não têm treinador: o dossiê precisa de um estado para isso |

---

## 3. Inventário do projeto de referência

**Stack:** React 19, Vite 8, `@supabase/supabase-js`, oxlint. `base: "./"`.

**Organização:** 20 componentes em pastas próprias com CSS colocalizado, mais as camadas
`model/`, `services/`, `repository/`, `hooks/`, `config/` e `utils/`.

| Camada | Arquivos | Papel |
| ------ | -------- | ----- |
| `model/` | `Pokemon.js`, `PokemonType.js`, `Trainer.js` | Fábricas que congelam o objeto e derivam número formatado, total e URLs |
| `services/` | `pokedexService.js` (120 linhas) | Carga do JSON, pesquisa, filtro, ordenação, posições |
| `hooks/` | `useFavoritos`, `usePokedexFilters`, `useTheme`, `useSkin`, `useReducedMotion` | Estado reutilizável |
| `components/` | `DeviceShell`, `PokedexCover`, `ClassicPokedex`, `PokemonCard`, `PokemonDetails`... | Interface |

**Conceito central:** a aplicação inteira roda dentro de um **aparelho Pokédex desenhado
em CSS** (carcaça vermelha, lente, LED, botões físicos), com uma capa que abre com um
clique e dois "skins" (Clássico e Holo). É um trabalho de CSS notável — o
`DeviceShell.css` sozinho tem 630 linhas.

**Pontos fortes que valem ser reaproveitados como ideia** (reimplementados, não copiados):

- Normalização de texto para a pesquisa (sem acento, sem pontuação).
- Reconhecer `25`, `#25` e `025` como pesquisa por número.
- Escolher a cor do texto sobre a cor do tipo pelo **contraste WCAG**, em vez de chutar.
- Cuidados de acessibilidade: `inert` no fundo do modal, `aria-live` na contagem,
  devolver o foco ao card que abriu os detalhes.
- Aplicar o tema no `index.html` antes do React, para a página não piscar.

---

## 4. Diagnóstico — limitações encontradas

| # | Limitação | Por que importa |
| - | --------- | --------------- |
| 1 | **Favoritos dependem do Supabase.** `useFavoritos` exige `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env.local`; sem elas a aba mostra "Favoritos desativados". | O desafio opcional da atividade é favoritar — e um avaliador que só rode `npm install && npm run dev` **não vê a funcionalidade**. Também é um serviço externo para guardar uma lista de números no próprio navegador. |
| 2 | **Não há comparação entre dois Pokémon.** | É um dos desafios opcionais explícitos do enunciado. |
| 3 | **`App.jsx` com 335 linhas**, 8 `useState` e 2 `useRef`, misturando animação da capa, abas, seleção, filtros e devolução de foco. | Componente-depósito: qualquer mudança exige ler o arquivo inteiro. |
| 4 | **Sem rotas.** Todo o estado de navegação vive em memória. | Recarregar perde a tela, o Pokémon aberto não tem endereço e o "voltar" do navegador sai da aplicação. |
| 5 | **Sem paginação ou carregamento progressivo.** 151 cards × 6 barras ≈ 900 barras montadas de uma vez. | Trabalho desperdiçado: cabem duas fileiras na tela. |
| 6 | **A metáfora do aparelho encaixota o conteúdo.** Em telas largas sobra moldura e falta área útil; os detalhes precisam de *container queries* de altura só para caber sem rolagem. | O desenho trabalha contra a tela em vez de usá-la. |
| 7 | **Sem estatísticas, sem histórico de pesquisa, sem página "Sobre".** | Falta a leitura de conjunto dos dados e a identificação do autor. |
| 8 | **Sem `ErrorBoundary`.** | Um erro de renderização apaga a tela e deixa a página em branco. |
| 9 | **Filtro por tipo aceita um tipo só.** | "Planta **e** Venenoso" é uma pergunta natural que não dá para fazer. |

---

## 5. Plano de evolução adotado

A decisão foi **construir um projeto novo e próprio**, e não remendar o de referência:
a identidade visual precisa ser própria (exigência da atividade), a metáfora do aparelho
é a espinha dorsal daquele código, e trocá-la equivaleria a reescrever tudo de qualquer
forma. Os **dados são rigorosamente os mesmos**.

| Frente | Decisão |
| ------ | ------- |
| **Dados** | `pokedex-data.json` copiado sem alteração, de `ATIVIDADES`. Nenhum atributo inventado, nenhum treinador ou vínculo removido. API externa só para imagem, com queda para arquivo local. |
| **Arquitetura** | Quatro camadas: `domain` (modelos) → `services` (regras, sem React) → `hooks` (estado) → `components`/`views` (apresentação). `App.jsx` fica só com composição, estado global e navegação. |
| **Favoritos** | `localStorage`, como pede o briefing. Funciona no primeiro `npm run dev`, sem configuração. |
| **Navegação** | Rotas por hash escritas no projeto (`useHashRoute`, ~40 linhas) em vez de uma biblioteca: três níveis de rota não justificam a dependência, e o build continua funcionando em subpasta. |
| **Comparação** | Tela própria, com seleção persistida e marcação direto nos cards da grade. |
| **Desempenho** | Carregamento progressivo com `IntersectionObserver`; `memo` nos cards; índices em `Map` no repositório. |
| **Identidade visual** | Sistema de tokens próprio, paleta de tipos recalibrada, tipografia Sora + Inter, ícones SVG desenhados no projeto, tema escuro como padrão. |
| **Interface** | Navegação lateral no desktop e barra inferior no celular; o conteúdo usa a largura da tela, sem moldura. |
| **Robustez** | `ErrorBoundary`, `localStorage` protegido por `try/catch`, imagens com lista de candidatos e substituto local. |
| **Documentação** | README profissional, documentação técnica, matriz de conformidade, relatório de testes e esta análise. |

### O que **não** foi feito, e por quê

- **Não migrar de tecnologia.** A atividade exige React + Vite; é o que está aqui.
- **Não substituir os dados por uma API.** A PokéAPI entra só como imagem.
- **Não recriar o aparelho em CSS.** É a identidade do projeto de referência, não a deste.
- **Não adicionar recurso por volume.** Cada extra responde a uma pergunta que o usuário
  realmente faz com esses dados ("quem é mais forte?", "quantos são de Fogo?",
  "quem tem este Pokémon no time?").
