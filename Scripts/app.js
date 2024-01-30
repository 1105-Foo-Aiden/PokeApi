let pokemonImg = document.getElementById("pokemonImg");
let searchBtn = document.getElementById("searchBtn");
let searchField = document.getElementById("searchField");
let randomBtn = document.getElementById("randomBtn");
let favBtn = document.getElementById("favBtn");
let data;
let shiny = false;

const ApiCall = async (pokemon) => {
  searchField.value = "";
  const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  data = await promise.json();

  const localFetch = await fetch(data.location_area_encounters);
  const localData = await localFetch.json();
  
  const evoFetch = await fetch(`${data.species.url}`);
  const evoData = await evoFetch.json();

  const evoChain = await fetch(`${evoData.evolution_chain.url}`);
  const evoChainData = await evoChain.json();

  if (evoChainData.chain.evolves_to.length === 0) {
    evolutions.textContent = "N/A";
  } else {
    const evoArr = [evoChainData.chain.species.name];

    const traverseEvolutions = (chain) => {
      if (chain.evolves_to.length === 0) return;

      chain.evolves_to.forEach((evo) => {
        evoArr.push(evo.species.name);
        traverseEvolutions(evo);
      });
    };
    traverseEvolutions(evoChainData.chain);
    evolutions.textContent = evoArr.join(" > ");
  }
  const moveArray = data.moves.map(move => move.move.name);
  const abilitiesArray = data.abilities.map(ability => ability.ability.name);
  const typeArr = data.types.map(type => type.type.name);
  
  names.innerText = data.name;
  let randLocal = Math.floor(Math.random(0, localData.length));
  locations.textContent = localData.length !== 0 ? "Locate them at: " + localData[randLocal].location_area.name : "N/A";

  pokemonImg.src = data.sprites.other["official-artwork"].front_default;
  moves.innerText = "Moves: " + moveArray.join(", ");
  abilities.innerText = "Abilities: " + abilitiesArray.join(", ");
  typing.innerText = "Type(s): " + typeArr.join(", ");
};

searchBtn.addEventListener("click", () => {
  searchField.value ? ApiCall(searchField.value): alert("Please enter a valid Pokemon");
});

randomBtn.addEventListener("click", () => {
  let random = Math.floor(Math.random() * 649) + 1;
  ApiCall(random);
});

pokemonImg.addEventListener("click", () => {
  shiny ? ((shiny = false), (pokemonImg.src = data.sprites.other["official-artwork"].front_shiny)) : ((shiny = true), (pokemonImg.src = data.sprites.other["official-artwork"].front_default));
});
