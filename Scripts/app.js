let searchBtn = document.getElementById("searchBtn");
let searchField = document.getElementById("searchField");
let randomBtn = document.getElementById("randomBtn");
let favBtn = document.getElementById("favBtn");
let showFavBtn = document.getElementById('showFavBtn')
let favList = document.getElementById('favList')
let data;
let shiny = false,  once = false


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

    const seeEvos = chain => {
      if (chain.evolves_to.length === 0) {
        return;
      }
      else{
        chain.evolves_to.forEach(evo => {
        evoArr.push(evo.species.name);
        seeEvos(evo);
        });
      } 
    };
    seeEvos(evoChainData.chain);
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
  shiny = false
  ApiCall(random);
});

pokemonImg.addEventListener("click", () => {
  shiny ? ((shiny = false), (pokemonImg.src = data.sprites.other["official-artwork"].front_shiny)) : ((shiny = true), (pokemonImg.src = data.sprites.other["official-artwork"].front_default));
});

favBtn.addEventListener('click', () =>{
    //grabbing the local storage key 'Favorites'
    let favorites = localStorage.getItem('favorites')
    //favorites being set up as an array if there aren't any present
    favorites = favorites ? JSON.parse(favorites) : []
    //pushin name of PKN into favorites
    if(favorites.includes(data.name)){
      favorites = favorites.filter(name => name !== data.name)
      ShowNotification(`You have removed ${data.name} from favorites`)
    }
    else{
      favorites.push(data.name)
      ShowNotification(`You've added ${data.name} to favorites!`)
    }
    //creating the local storage key named, favorites
    localStorage.setItem('favorites', JSON.stringify(favorites))
})

const ShowNotification = (message) =>{
    //targetting p tag in div
    FavAdded.querySelector('p').textContent = message
    FavAdded.style.display = 'block'
    //timer
    setTimeout(() => {
        FavAdded.style.display = 'none'
    }, 4000);
    //reset timer
    setTimeout(() => {
        FavAdded.style.display = 'none'
    }, 4000)
}

showFavBtn.addEventListener('click', () =>{
    let favorites = localStorage.getItem('favorites')
    let pknName = document.createElement('li')
    let emptyFav = document.createElement('p')
    favorites = JSON.parse(favorites)
    favorites = favorites.join(', ')
    if(favorites.length > 0)
    {
        if(once){
          favList.removeChild(pknName)
          once = false
        }
        else{
          pknName.textContent = favorites
          favList.appendChild(pknName)
          once = true
        }
    }
    else{
      if(once){
        favList.removeChild(emptyFav) 
        once = false
      }
      else{
        emptyFav.style = "color: white" 
        emptyFav.textContent = 'You have no Saved Pokemon, go catch them!' 
        favList.appendChild(emptyFav)  
        once = true
      }   
    }
})