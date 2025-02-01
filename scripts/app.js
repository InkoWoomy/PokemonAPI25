import { getFromFavs, saveToFavs, removeFromFavs } from "./localstorage.js";

//Document data
const pkmnDataName = document.getElementById("pkmnDataName");
const pkmnDataDexNo = document.getElementById("pkmnDataDexNo");
const pkmnDataIcon = document.getElementById("pkmnDataIcon");
const pkmnDataAnimatedIcon = document.getElementById("pkmnDataAnimatedIcon");
const pkmnDataTypes = document.getElementById("pkmnDataTypes");
const pkmnDataCry = document.getElementById("pkmnDataCry");
const pkmnDataGeneral = document.getElementById("pkmnDataGeneral");
const pkmnDataEvolution = document.getElementById("pkmnDataEvolution");
const pkmnDataGame = document.getElementById("pkmnDataGame");
const pkmnSpecies = document.getElementById("pkmnSpecies");
const pkmnHeight = document.getElementById("pkmnHeight");
const pkmnWeight = document.getElementById("pkmnWeight");
const pkmnDexEntry = document.getElementById("pkmnDexEntry");
const pkmnDataLocationTitle = document.getElementById("pkmnDataLocationTitle")
const pkmnDataLocations = document.getElementById("pkmnDataLocations");
const pkmnDataAbilities = document.getElementById("pkmnDataAbilities");
const pkmnDataAbilitiesTitle = document.getElementById("pkmnDataAbilitiesTitle")
const pkmnDataMovesTitle = document.getElementById("pkmnDataMovesTitle");
const pkmnDataMoves = document.getElementById("pkmnDataMoves");
const favList = document.getElementById("favList");
const favBtn = document.getElementById("favBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const cryBtn = document.getElementById("cryBtn");
const shinyBtn = document.getElementById("shinyBtn");
const searchBtn = document.getElementById("searchBtn");
const searchText = document.getElementById("searchText");
const btnGeneral = document.getElementById("btnGeneral");
const btnEvolution = document.getElementById("btnEvolution");
const btnGameData = document.getElementById("btnGameData");
const evoList = document.getElementById("evoList");
const basicPkmn = document.getElementById("basicPkmn");
const stage1Pkmn = document.getElementById("stage1Pkmn");
const stage2Pkmn = document.getElementById("stage2Pkmn");


//Declarations
let pkmnName = Math.ceil(Math.random() * 649);
let pkmnData = [];
let speciesData = [];
let evolutionData = [];
let basicPokemon = [];
let movesData = [];
let abilitiesData = [];
let locationData = [];
let evoPathData = [];
let shinyToggle = false;


//fetches
//General Pokemon Data
async function getDataGeneral(nameId)
{
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameId}/`);
    const data = promise.json();
    return data;
}

//Extra Data
async function getExtraData(path)
{
    const promise = await fetch(path);
    const data = promise.json();
    return data;
}

//General Functions
function capitalize(s)
{
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
}

//Test Data gather
async function SearchPokemon(pkmnSearch)
{
    console.clear();
    let prevData = pkmnData 
    
    //Basic Pokemon Data
    pkmnData = await getDataGeneral(pkmnSearch);
    console.log("Pokemon Data:\n", pkmnData);
    
    //Check to see if the pokemon is outside the asking range (cannot be a pokemon gen VI or higher)
    console.log("DexNo.", pkmnData.id);
    if (pkmnData.id > 649)
    {
        console.log("This Pokemon is invalid!");
        pkmnData = prevData;
        return null;
    }
    pkmnDataDexNo.innerText = "National Dex No. " + pkmnData.id;

    console.log("Name:", capitalize(pkmnData.name));
    pkmnDataName.innerText = capitalize(pkmnData.name);


    console.log("Height:", (pkmnData.height/10).toFixed(1),"m");
    pkmnHeight.innerText = "Height: "+ (pkmnData.height/10).toFixed(1)+" m";
    console.log("Weight:", (pkmnData.weight/10).toFixed(1),"kg");
    pkmnWeight.innerText = "Weight: "+ (pkmnData.weight/10).toFixed(1)+" kg";

    pkmnDataTypes.innerHTML = "";
    pkmnData.types.map(type => {
        console.log("Type:", type);

        let h1 = document.createElement('h1');
        h1.className = `col-start-${type.slot} border-opacity-50 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl type-${type.type.name}`;
        if (pkmnData.types.length == 1)
        {
            h1.className += ` col-span-2`;
        }
        h1.innerText = type.type.name.toUpperCase();
        
        pkmnDataTypes.appendChild(h1);
    });

    pkmnDataCry.src = pkmnData.cries.latest;

    pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_default;
    pkmnDataIcon.alt = capitalize(pkmnData.name)+"OfficialArtwork";

    pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_default;
    pkmnDataIcon.alt = capitalize(pkmnData.name)+"ShowdownIcon";
    
    //Spawn Data
    locationData = await getExtraData(pkmnData.location_area_encounters);
    console.log("Location Data\n", locationData.length < 1 ? null : locationData);
    
    //Species Data for the Pokemon
    speciesData = await getExtraData(pkmnData.species.url);
    console.log("Species Data\n", speciesData);

    //Pokedex Entry 
    for (let i = 0; i < speciesData.flavor_text_entries.length; i++)
    {
        //Here we look for the English entry of the pokemon from Pokemon X. We break in order to generate only 1 dex entry.
        if (speciesData.flavor_text_entries[i].language.name === "en" && speciesData.flavor_text_entries[i].version.name === "x")
        {
            console.log("Dex Entry:\n",speciesData.flavor_text_entries[i].flavor_text);
            pkmnDexEntry.innerText = speciesData.flavor_text_entries[i].flavor_text;
            break;
        }
        
    }

    for (let i = 0; i < speciesData.genera.length; i++)
    {
        if (speciesData.genera[i].language.name == "en")
        {
            pkmnSpecies.innerText = speciesData.genera[i].genus
            break;
        }
    }

    //Searching for Evo Data
    evolutionData = await getExtraData(speciesData.evolution_chain.url);
    console.log("Evolution Data:\n", evolutionData);

    
    //Data for the first pokemon in the evo line
    basicPokemon = await getExtraData(evolutionData.chain.species.url);
    console.log("Basic Pokemon:\n", basicPokemon);

    //Moves Data
    movesData = [];
    for (let i = 0; i < pkmnData.moves.length; i++)
    {
        let moveName = pkmnData.moves[i].move.name;

        moveName = moveName.split("-").map((word, index) =>
        {
            return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        movesData.push(capitalize(moveName));
    }
    

    pkmnDataMovesTitle.innerText = `Moves it can learn:`

    console.log("Moves Data:\n", movesData);
    pkmnDataMoves.innerHTML = "";

    movesData.map(index => {
        let h1 = document.createElement('h1');
        h1.className = `px-2 bg-slate-300`;
        h1.innerText = index;
        
        pkmnDataMoves.appendChild(h1);
    });

    //Abilities Data
    abilitiesData = [];
    pkmnDataAbilities.innerHTML = "";
    for (let i = 0; i < pkmnData.abilities.length; i++)
    {
        let abilityName = pkmnData.abilities[i].ability.name;

        abilityName = abilityName.split("-").map((word, index) =>
        {
            return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        abilitiesData.push(capitalize(abilityName));
    }

    console.log("Abilities Data:\n", abilitiesData);
    pkmnDataAbilitiesTitle.innerText = `Abilities for ${capitalize(pkmnData.name)}:`
    abilitiesData.map(index => {
        let h1 = document.createElement('h1');
        h1.className = `px-2 bg-slate-300`;
        h1.innerText = index;
        
        pkmnDataAbilities.appendChild(h1);
    });

    //Location Data

    let locationDataReturn = [];
    for (let i = 0; i < locationData.length; i++)
    {
        let locationName = locationData[i].location_area.name;
        locationName = locationName.split("-").map((word, index) =>
        {
            return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        locationDataReturn.push(capitalize(locationName));
    }
    
    pkmnDataLocations.innerHTML = "";
    console.log("Location Data:\n", locationData)
    pkmnDataLocationTitle.innerText = `Possible Locations`
    if (locationDataReturn.length == 0)
    {
        let h1 = document.createElement('h1');
            h1.className = `px-2 bg-slate-300`;
            h1.innerText = "N/A";
            pkmnDataLocations.appendChild(h1);

    } else {
        locationDataReturn.map(index => {
            let h1 = document.createElement('h1');
            h1.className = `px-2 bg-slate-300`;
            h1.innerText = index;
            pkmnDataLocations.appendChild(h1);
        });
    }

    evoPathData = [];
    let basicEvoData = [];
    let stage1Data = [];
    let stage2Data = [];


    //Evolutions Data
    console.log(evolutionData.chain.evolves_to.length);

    basicEvoData.push({
        "name": evolutionData.chain.species.name
    })

    console.log("BASIC", evolutionData.chain.species.name);
    for (let i = 0; i < evolutionData.chain.evolves_to.length; i++)
    {
        console.log("ITERATING STAGE 1")
        stage1Data.push({
            "name": evolutionData.chain.evolves_to[i].species.name
        })
        console.log("STAGE1", evolutionData.chain.evolves_to[i].species.name);

        for (let j = 0; j < evolutionData.chain.evolves_to[i].evolves_to.length; j++)
        {
            console.log("ITERATING STAGE 2")
            stage2Data.push({
                "name": evolutionData.chain.evolves_to[i].evolves_to[j].species.name
            })
            console.log("STAGE1", evolutionData.chain.evolves_to[i].evolves_to[j].species.name);
        } 
    } 
    console.log("Basic PKMN\n", basicEvoData);
    console.log("Stage 1 PKMN\n", stage1Data);
    console.log("Stage 2 PKMN\n", stage2Data);
    
    //EVO StufF
    basicPkmn.innerHTML = [
        `<h1 class="col-span-2 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl relative">Basic Pokemon</h1>`
    ];
    if (stage2Data.length > 0)
        {
            stage1Pkmn.innerHTML = [
                `<h1 class="col-span-2 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl relative">Middle Evolution(s)</h1>`
            ];
            stage2Pkmn.innerHTML = [
                `<h1 class="col-span-2 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl relative">Final Evolution(s)</h1>`
            ];
        } else {
            stage1Pkmn.innerHTML = [
                `<h1 class="col-span-2 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl relative">Final Evolution(s)</h1>`
            ];
        }
    
    if (stage1Data.length > 0)
        {
            
            if (stage2Data.length > 0)
                {
                    evoList.className = "grid grid-cols-3 h-72";
                } else {
                    evoList.className = "grid grid-cols-2 h-72";
                }
            } else {
                evoList.className = "grid grid-cols-1 h-72";
            }
            
            
            basicEvoData.map(async index => {
                console.log("MAPP");
                let imageSource = await getExtraData(`https://pokeapi.co/api/v2/pokemon/${index.name}/`);
                let img = document.createElement("img");
                console.log("IMG\n",imageSource);
                img.src = imageSource.sprites.other["official-artwork"].front_default;
                img.alt = basicEvoData.name;
                img.className = "col-start-1 w-96 justify-self-center"
                img.addEventListener('click', function(){
                    SearchPokemon(index.name);
                });
                basicPkmn.appendChild(img);
            });

            stage1Data.map(async index => {
                console.log("MAPP");
                let imageSource = await getExtraData(`https://pokeapi.co/api/v2/pokemon/${index.name}/`);
                let img = document.createElement("img");
                console.log("IMG\n",imageSource);
                img.src = imageSource.sprites.other["official-artwork"].front_default;
                img.alt = basicEvoData.name;
                img.className = "col-start-2 w-96 justify-self-center"
                img.addEventListener('click', function(){
                    SearchPokemon(index.name);
                });
                stage1Pkmn.appendChild(img);
            });

            stage2Data.map(async index => {
                console.log("MAPP");
                let imageSource = await getExtraData(`https://pokeapi.co/api/v2/pokemon/${index.name}/`);
                let img = document.createElement("img");
                console.log("IMG\n",imageSource);
                img.src = imageSource.sprites.other["official-artwork"].front_default;
                img.alt = basicEvoData.name;
                img.className = "col-start-3 w-96 justify-self-center"
                img.addEventListener('click', function(){
                    SearchPokemon(index.name);
                });
                stage2Pkmn.appendChild(img);
            });

          
    
    
    
}


SearchPokemon(pkmnName);

//Event listener for searching basaed on input
searchBtn.addEventListener('click', function()
{
    favList.innerHTML = [];
    SearchPokemon(searchText.value.toLowerCase());
})

//Event listener for pokemon cries
cryBtn.addEventListener('click', function()
{
   
    
    //#1 3DS Pikachu Cry Hater. Thank goodness they changed it in Legends and Scarlet/Violet.
    if (pkmnData.id == 25)
        {
            pkmnDataCry.src = pkmnData.cries.legacy;
        } 
        
    pkmnDataCry.volume = 0.2;
    pkmnDataCry.play();
})

//Event listener for toggling shiny icons
shinyBtn.addEventListener('click', function()
{
    shinyToggle = !shinyToggle;
    if (shinyToggle)
    {
        pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_shiny;
        pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_shiny;
    } else {
        pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_default;
        pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_default;
    }
})

btnGeneral.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: block";
    pkmnDataEvolution.style = "display: none";
    pkmnDataGame.style = "display: none";
})

btnEvolution.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: none";
    pkmnDataEvolution.style = "display: block";
    pkmnDataGame.style = "display: none";
})

btnGameData.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: none";
    pkmnDataEvolution.style = "display: none";
    pkmnDataGame.style = "display: block";
})

favBtn.addEventListener('click', function()
{
    console.log(`ADDING ${pkmnData.name} TO FAVORITES`)
    if(pkmnData.name == "")
    { 
        return null;
    }
    saveToFavs(pkmnData.name);
    console.log(getFromFavs());
});

shuffleBtn.addEventListener('click', function()
{
    SearchPokemon(Math.ceil(Math.random() * 649));
});

searchText.addEventListener('click', async() =>
{
    let favoriteList = await getFromFavs();
    favList.innerHTML = "";

    favoriteList.map(index => {
        let h1 = document.createElement('h1');
        h1.type = "button";
        h1.className = `col-span-2 px-2 bg-white hover:bg-blue-200 rounded-s-xl`;
        h1.innerText = capitalize(index);
        h1.addEventListener('click', function()
        {
            favList.innerHTML = [];
            SearchPokemon(index.toLowerCase());
        })  

        let favDelete = document.createElement('button');
        favDelete.type = "button";
        favDelete.className = `col-start-3 bg-white h-full hover:bg-blue-300 rounded-e-2xl`
        favDelete.innerHTML =  `<img src="../assets/img/StarOn.png" class="m-3 justify-self-center">`;
        favDelete.addEventListener('click', function()
        {
            removeFromFavs(index);
            favList.removeChild(h1);
            favList.removeChild(favDelete);
        })
        
        console.log(index);
        favList.appendChild(h1);
        favList.appendChild(favDelete);
    });
});