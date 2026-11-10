import { useMemo, useState } from "react";
import { filterPokemon } from "../../services/pokedexQuery";
import { allPokemon } from "../../services/pokedexRepository";
import EmptyState from "../ui/EmptyState";
import Modal from "../ui/Modal";
import SmartImage from "../ui/SmartImage";
import SearchField from "../pokemon/SearchField";
import "./PokemonPicker.css";

/**
 * Seletor de Pokémon para o comparador.
 *
 * Reaproveita exatamente a mesma função de pesquisa da Pokédex
 * (`filterPokemon`), e não uma segunda implementação parecida — se a regra de
 * busca por nome ou número mudar, muda nos dois lugares de uma vez.
 *
 * `excludeId` esconde o Pokémon que já está no outro lado, para não existir uma
 * comparação de um Pokémon consigo mesmo.
 */
export default function PokemonPicker({ open, onClose, onSelect, excludeId, title }) {
  const [search, setSearch] = useState("");

  const options = useMemo(() => {
    const base = allPokemon().filter((pokemon) => pokemon.id !== excludeId);
    return filterPokemon(base, { search });
  }, [search, excludeId]);

  function choose(id) {
    onSelect(id);
    setSearch("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} size="md" labelledBy="picker-title">
      <div className="picker">
        <h2 className="picker__title" id="picker-title">
          {title}
        </h2>

        <SearchField value={search} onChange={setSearch} placeholder="Nome ou número..." />

        {options.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nenhum Pokémon encontrado"
            description="Verifique a grafia ou pesquise pelo número, de 1 a 151."
            actions={[{ label: "Limpar pesquisa", onClick: () => setSearch(""), primary: true }]}
          />
        ) : (
          <ul className="picker__list">
            {options.map((pokemon) => (
              <li key={pokemon.id}>
                <button
                  type="button"
                  className="picker__item"
                  style={{ "--type-rgb": pokemon.types[0].rgb }}
                  onClick={() => choose(pokemon.id)}
                >
                  <SmartImage
                    sources={[pokemon.sprite]}
                    alt=""
                    width={44}
                    height={44}
                    pixelated
                  />
                  <span className="picker__item-name">{pokemon.name}</span>
                  <span className="picker__item-id numeric">#{pokemon.number}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
