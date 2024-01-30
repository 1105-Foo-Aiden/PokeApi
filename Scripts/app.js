let pokemonImg = document.getElementById("pokemonImg");
let searchBtn = document.getElementById("searchBtn");
let searchField = document.getElementById("searchField");
let randomBtn = document.getElementById("randomBtn");
let favBtn = document.getElementById("favBtn");
let moves = document.getElementById("moves");
let names = document.getElementById("name");
let typing = document.getElementById("typing");
let abilities = document.getElementById("abilities");
let evolutions = document.getElementById("evoPath");
let locations = document.getElementById("locations");
let data
let shiny = false;

const ApiCall = async (pokemon) => {
  searchField.value = "";
  let moveArray = [];
  let abilitiesArray = [];
  let typeArr = [];
  let evoArr = [];
  const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  data = await promise.json();

  const localFetch = await fetch(data.location_area_encounters);
  const localData = await localFetch.json();
  console.log(data);

  const evoFetch = await fetch(`${data.species.url}`);
  const evoData = await evoFetch.json();

  const evoChain = await fetch(`${evoData.evolution_chain.url}`);
  const evoChainData = await evoChain.json();
  console.log(evoChainData.chain);
  console.log(evoChainData.chain.evolves_to.length);
  if (evoChainData.chain.evolves_to.length === 0) {
    evolutions.textContent = "N/A";
  }
  else if(evoChainData.chain.evolves_to.length > 1){
    for (let i = 0; i < evoChainData.chain.evolves_to.length; i++){
        evoArr.push(evoChainData.chain.evolves_to[i].species.name);
    }
    evolutions.textContent = evoArr.join(", "); 
  } 
  else {
    evoArr.push(evoChainData.chain.species.name);
    for (let i = 0; i < evoChainData.chain.evolves_to.length; i++) {
      evoArr.push(evoChainData.chain.evolves_to[i].species.name);
      if (evoChainData.chain.evolves_to[i].evolves_to.length !== 0) {
        evoArr.push(
          evoChainData.chain.evolves_to[i].evolves_to[i].species.name
        );
      } 
      evolutions.textContent = evoArr.join(", ");
    }
  }

  names.innerText = data.name;

  for (let i = 0; i < data.moves.length; i++) {
    moveArray.push(data.moves[i].move.name);
  }
  for (let i = 0; i < data.abilities.length; i++) {
    abilitiesArray.push(data.abilities[i].ability.name);
  }
  for (let i = 0; i < data.types.length; i++) {
    typeArr.push(data.types[i].type.name);
  }
  let randLocal = Math.floor(Math.random(0, localData.length));
  locations.textContent =
    localData.length !== 0 ? "Locate them at: " + localData[randLocal].location_area.name : "N/A";

  pokemonImg.src = data.sprites.other["official-artwork"].front_default;
  moves.innerText = "Moves: " + moveArray.join(", ");
  abilities.innerText = "Abilities: " + abilitiesArray.join(", ");
  typing.innerText = "Type(s): " + typeArr.join(", ");
};

searchBtn.addEventListener("click", () => {
    if(searchField.value){
       ApiCall(searchField.value.toLowerCase()); 
    }
    else{
        alert('please enter a valid pokemon')
    }
  
});

randomBtn.addEventListener("click", () => {
  let random = Math.floor(Math.random() * 649) + 1;
  ApiCall(random);
});

pokemonImg.addEventListener('click', () =>{
    if(!shiny){
      pokemonImg.src = data.sprites.other["official-artwork"].front_shiny  
      shiny = true
    }
    else{
        pokemonImg.src = data.sprites.other["official-artwork"].front_default
        shiny = false
    }
    
})
