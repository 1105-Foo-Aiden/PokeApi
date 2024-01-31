let searchBtn = document.getElementById("searchBtn");
let searchField = document.getElementById("searchField");
let randomBtn = document.getElementById("randomBtn");
let favBtn = document.getElementById("favBtn");
let showFavBtn = document.getElementById('showFavBtn')
let favList = document.getElementById('favList')
let data
let shiny = false


const ApiCall = async (pokemon) => {
  let favorites = localStorage.getItem('favorites')
  favorites = JSON.parse(favorites)

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
  favBtn.textContent = favorites.includes(data.name) ? 'Unfavorite' : 'Favorite'
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
  shiny ? ((shiny = false), (pokemonImg.src = data.sprites.other["official-artwork"].front_default)) : ((shiny = true), (pokemonImg.src = data.sprites.other["official-artwork"].front_shiny));
});

favBtn.addEventListener('click', () =>{
    let favorites = localStorage.getItem('favorites')
    favorites = favorites ? JSON.parse(favorites) : []
  
    if(favorites.includes(data.name)){
      favorites = favorites.filter(name => name !== data.name)
      ShowNotification(`You have removed ${data.name} from favorites`)
      favBtn.textContent = "Favorite"
    }
    else{
      favorites.push(data.name)
      ShowNotification(`You've added ${data.name} to favorites!`)
      favBtn.textContent = "Unfavorite"
    }
   
    localStorage.setItem('favorites', JSON.stringify(favorites))
})

const ShowNotification = (message) =>{
    //targetting p tag in div
    FavAdded.querySelector('p').textContent = message
    FavAdded.style.display = 'block'
    //timers
    setTimeout(() => {
        FavAdded.style.display = 'none'
    }, 4000);
    setTimeout(() => {
        FavAdded.style.display = 'none'
    }, 4000)
}

showFavBtn.addEventListener('click', async () =>{
    let favorites = localStorage.getItem('favorites')
    let pknName = document.createElement('h4')
    let emptyFav = document.createElement('h3')
    
    if(favorites.length !== 0)
    {
      favorites = JSON.parse(favorites)
      pknName.textContent = favorites.join(", ")
      favList.innerHTML = ""
      favList.appendChild(pknName)

      for(let i = 0; i < favorites.length; i++)
      {
        await favCall(favorites[i])
      }
      
    }
   if(!favorites || favorites.length == 0){
      emptyFav.textContent = 'You have no Saved Pokemon, go catch them!'   
      favList.appendChild(emptyFav)
    }
    
})

const favCall = async fav =>{
  let favPKMimg = document.createElement('img')
  const favpromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${fav}`)
  const favdata = await favpromise.json()
  favPKMimg.src = favdata.sprites.other.showdown.front_default
  favPKMimg.addEventListener('click', () =>{
    ApiCall(favdata.name)
  })
  favList.appendChild(favPKMimg)
}